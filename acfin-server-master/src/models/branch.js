// Rule is needed to be disabled for Mongoose
/* eslint-disable no-invalid-this */
// Rule is needed to be disabled for the ObjectId to be parsed correctly
/* eslint-disable new-cap */
const { Schema, connection } = require('mongoose')
const { schemaFactory, modelFactory } = require('mongodb-plugin')
const autopopulate = require('mongoose-autopopulate')
const { isEmail } = require('validator')

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
        company: {
            type: "ObjectId",
            ref: "Company",
            required: [
                true,
                'Branch company is required.'
            ]
        },
        name: {
            type: 'String',
            required: [
                true,
                'Branch name is required'
            ]
        },
        address: {
            type: 'String',
            required: [
                true,
                'Branch address is required'
            ]
        },
        email: {
            type: "String",
            required: [
                true,
                'Branch e-mail address is required.'
            ],
            validate: [
                isEmail,
                `Branch e-mail should be a valid e-mail address.`
            ],
            immutable: (doc) => doc.userType === 'Guest'
        },
        mobile: {
            type: "String",
            required: [
                true,
                'Branch mobile number is required'
            ]
        },
        telephone: {
            type: "String"
        }
    }, 
    {
        timestamps: {
            createdAt: 'dateCreated',
            updatedAt: 'dateUpdated'
        }
    }
)

schema.pre('save', (next) => {
    next()
})

schema.pre('remove', (next) => {
    next()
})

schema.statics.dataView = {
    directoryPartnerBanks: async (session) => {
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
                        $eq: [
                            currentUser.singleBranch,
                            '$_id'
                        ]
                    }
                }
            }
        }
        if (session.userRole.includes('salesManager')) {
            match = {
                $match: {
                    $expr: {
                        $in: [
                            '$_id',
                            currentUser.multipleBranch
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
            match,
            {
                $lookup: {
                    from: 'companies',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'companyData'
                }
            },
            {
                $unwind: {
                    path: '$companyData',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    companyName: '$companyData.name'
                }
            }
        ]
    },
    read: [
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
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'company',
                foreignField: '_id',
                as: 'companyData'
            }
        },
        {
            $unwind: {
                path: '$companyData',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                companyName: '$companyData.name'
            }
        }
    ],
    default: async (session) => {
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
                        $eq: [
                            currentUser.singleBranch,
                            '$_id'
                        ]
                    }
                }
            }
        }
        else if (session.userRole.includes('salesExecutive')) {
            match = {
                $match: {
                    _id: currentUser.singleBranch
                }
            }
        }
        else if (session.userRole.includes('salesManager')) {
            match = {
                $match: {
                    $expr: {
                        $in: [
                            '$_id',
                            currentUser.multipleBranch
                        ]
                    }
                }
            }
        }
        else if (session.userRole.includes('superUser')) {
            match = {
                $match: {
                    $expr: {
                        $in: [
                            '$_id',
                            currentUser.multipleBranch
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
            match,
            {
                $lookup: {
                    from: 'companies',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'companyData'
                }
            },
            {
                $unwind: {
                    path: '$companyData',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    companyName: '$companyData.name'
                }
            }
        ]
    }
}

schema.statics.search = {
    default: function(search) {
        const searchAttributes = [
            'name',
            'email',
            'mobile',
            'telephone' 
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


schema.plugin(autopopulate) 
const modifiedSchema = schemaFactory(schema)
const model = modelFactory({
    schema: modifiedSchema,
    modelName: 'Branch'
})

module.exports = model