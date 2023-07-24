// Rule is needed to be disabled for Mongoose
/* eslint-disable no-invalid-this */
// Rule is needed to be disabled for the ObjectId to be parsed correctly
/* eslint-disable new-cap */
const { Schema, connection } = require('mongoose')
const { ObjectId } = require('mongoose').Types
const { schemaFactory, modelFactory } = require('mongodb-plugin')
const autopopulate = require('mongoose-autopopulate')
const { isEmail } = require('validator')
const { brands } = require('./lib/meta')

const {
    padDates = true,
    padTimes = true
} = require('../config/meta')

const aggregationHelper = require('../lib/aggregationHelpers')({
    padDates,
    padTimes
})

const schema = new Schema(
    {
        name: {
            type: 'String',
            required: [
                true,
                'Name of Bank is required'
            ]
        },
        branch: {
            type: [ 'ObjectId' ],
            required: [
                true,
                'Branch is required'
            ]
        },
        brand: {
            type: [ String ],
            enum: brands
        },
        contactPerson: {
            type: 'String',
            required: [
                true,
                'Contact Person is required'
            ]
        },
        designation: {
            type: 'String',
            required: [
                true,
                'Designation is required'
            ]
        },
        department: {
            type: 'String',
            required: [
                true,
                'Department is required'
            ]
        },
        email: {
            type: "String",
            required: [
                true,
                'E-mail address is required.'
            ],
            validate: [
                isEmail,
                `E-mail should be a valid e-mail address.`
            ]
        },
        mobileNo: {
            type: [ 'String' ],
            required: [
                true,
                'Mobile number is required.'
            ]
        }
    }, 
    {
        timestamps: {
            createdAt: 'dateCreated',
            updatedAt: 'dateUpdated'
        }
    }
)

schema.statics.dataView = {
    default: [
        ...aggregationHelper.to12HourString({
            fieldName: 'dateCreated'
        }),
        ...aggregationHelper.to12HourString({
            fieldName: 'dateUpdated'
        }),
        {
            $addFields: {
                createdBy: '$_revision.author.userModel',
                updatedBy: '$_revision.author.userModel'
            }
        },
        {
            $match: {
                _status: {
                    $ne: 'deleted'
                }
            }
        }
    ],
    table: async (session) => {
        let match = {
            $match: {
            }
        }
        const { User } = connection.models
        const currentUser = await User.findById(session.user)
        if (session.userRole.includes('systemAdmin')) {
            match = {
                $match: {
                    $expr: {
                        $in: [
                            currentUser.singleBranch,
                            '$branch'
                        ]
                    }
                }
            }
        }
        return [
            ...aggregationHelper.to12HourString({
                fieldName: 'dateCreated'
            }),
            ...aggregationHelper.to12HourString({
                fieldName: 'dateUpdated'
            }),
            match,
            {
                $addFields: {
                    createdBy: '$_revision.author.userModel',
                    updatedBy: '$_revision.author.userModel'
                }
            },
            {
                $match: {
                    _status: {
                        $ne: 'deleted'
                    }
                }
            },
            {
                $lookup: {
                    from: 'branches',
                    localField: 'branch',
                    foreignField: '_id',
                    as: 'branchObjects'
                }
            },
            {
                "$addFields": {
                    "branch": {
                        "$map": {
                            "input": "$branchObjects",
                            "as": "el",
                            "in": "$$el.name"
                        }
                    }
                }
            }
        ]
    },
    select: [
        ...aggregationHelper.to12HourString({
            fieldName: 'dateCreated'
        }),
        ...aggregationHelper.to12HourString({
            fieldName: 'dateUpdated'
        }),
        {
            $addFields: {
                createdBy: '$_revision.author.userModel',
                updatedBy: '$_revision.author.userModel'
            }
        },
        {
            $match: {
                _status: {
                    $ne: 'deleted'
                }
            }
        }
        // {
        //     $addFields: {
        //         name: {
        //             $concat: [
        //                 '$name',
        //                 ' ',
        //                 '(',
        //                 '$email',
        //                 ')'
        //             ]
        //         }
        //     }
        // }
    ]
}
schema.pre('save', async function (next) {
    const { _id, name, _status } = this
    if (_status === 'deleted') {
        const query = {
            'vehiclePurchased.banks': ObjectId(_id)
        }
        const financePartnerCount = await connection.models.Application.countDocuments(query)
        if (financePartnerCount) {
            throw new Error(`Cannot delete Finance Partner named ${name}, as it is currently being used.`)
        }
    }
    const findBranchesQuery = {
        _status: 'active',
        name: this.name
    }
    const financePartners = await connection.models.FinancingPartner.find(findBranchesQuery)
    for (const content of financePartners) {
        if (this._id.toString() !== content._id.toString()) {
            const foundBranches = this.branch && this.branch.some((r) => content.branch && content.branch.includes(r))
            if (foundBranches) {
                throw new Error('Cannot create Finance Partner, branch/es currently being used')
            }
        }
    }
    next()
})

schema.statics.search = {
    default: function(search) {
        const searchAttributes = [
            'name',
            'branch',
            'contactPerson',
            'designation',
            'department',
            'email',
            'contactNo',
            'mobileNo'
        ]
        const searchFields = searchAttributes.map((attr) => ({
            [attr]: {
                $regex: search,
                $options: 'i'
            }
        }))
        
        return [].concat([
            {
                $match: {
                    $or: searchFields
                }
            }
        ])
    }
}
schema.index({
    name: 1,
    contactPerson: 1
}, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
});

schema.plugin(autopopulate) 
const modifiedSchema = schemaFactory(schema)
const model = modelFactory({
    schema: modifiedSchema,
    modelName: 'FinancingPartner'
})

module.exports = model