// Rule is needed to be disabled for Mongoose
/* eslint-disable no-invalid-this */
// Rule is needed to be disabled for the ObjectId to be parsed correctly
/* eslint-disable new-cap */
const { Schema, connection } = require('mongoose')
const { schemaFactory, modelFactory } = require('mongodb-plugin')
const autopopulate = require('mongoose-autopopulate')
const { isEmail } = require('validator')
const attachment = require('../schema/attachment')

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
                'Company name is required'
            ],
            index: {
                unique: true,
                collation: {
                    locale: 'en',
                    strength: 2
                }
            }
        },
        address: {
            type: 'String',
            required: [
                true,
                'Company address is required'
            ]
        },
        email: {
            type: "String",
            required: [
                true,
                'Company e-mail address is required.'
            ],
            validate: [
                isEmail,
                `Company e-mail should be a valid e-mail address.`
            ],
            immutable: (doc) => doc.userType === 'Guest'
        },
        mobile: {
            type: "String",
            required: [
                true,
                'Company mobile number is required'
            ]
        },
        telephone: {
            type: "String"
        },
        logo: {
            type: [ attachment ]
        }
    }, 
    {
        timestamps: {
            createdAt: 'dateCreated',
            updatedAt: 'dateUpdated'
        }
    }
)

schema.statics.upload = {
    logo: {
        dest: 'acfin-files',
        folder: 'company-logos',
        mimeTypes: [
            "image/jpeg", 
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize: 5242880
    }
}

schema.pre('save', (next) => {
    next()
})

schema.pre('remove', (next) => {
    next()
})

schema.statics.dataView = {
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
                            '$branchesId'
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
                $lookup: {
                    from: 'branches',
                    let: {
                        "companyId": "$_id"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        "$company",
                                        "$$companyId"
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'branches'
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
                "$addFields": {
                    "branchesId": {
                        "$map": {
                            "input": "$branches",
                            "as": "el",
                            "in": "$$el._id"
                        }
                    }
                }
            },
            match,
            {
                "$addFields": {
                    "branches": {
                        "$map": {
                            "input": "$branches",
                            "as": "el",
                            "in": "$$el.name"
                        }
                    }
                }
            }
        ]
    },
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
            $lookup: {
                from: 'branches',
                let: {
                    "companyId": "$_id"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    "$company",
                                    "$$companyId"
                                ]
                            }
                        }
                    }
                ],
                as: 'branches'
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
            "$addFields": {
                "branchesName": {
                    "$map": {
                        "input": "$branches",
                        "as": "el",
                        "in": "$$el.name"
                    }
                }
            }
        }
    ]
}

schema.statics.children = async function(data, company, doc) {
    const { Branch } = connection.models
    const { _id, ...info } = data
    if (_id) {
        const result = await Branch.findById(_id)

        result._revision = {
            author: {
                userModel: 'User',
                doc: doc._id
            },
            description: `Modified Branch document.`
        }

        const updatedResult = Object.assign(result, {
            ...info
        })

        await updatedResult.save()
    }
    else {
        await Branch.create({
            ...info,
            company,
            createdBy: doc._id,
            updatedBy: doc._id,
            _revision: {
                author: {
                    userModel: 'User',
                    doc: doc._id
                },
                description: `Created a document for Branch by ${doc.firstName} ${doc.middleName ? `${doc.middleName}` : ''} ${doc.lastName}.`
            }
        })
    }
}

schema.statics.childrenCleanup = async function(ids, company) {
    const { Branch, Application, FinancingPartner, Freight } = connection.models
    
    const branches = await Branch.find({
        company
    })
    const errors = []
    await Promise.all(branches.map(async (branch) => {
        if (!ids.includes(branch._id.toString())) {
            //check
            const applications = await Application.find({
                'vehiclePurchased.branch': branch._id
            })
            const financingPartners = await FinancingPartner.find({
                branch: branch._id
            })
            const freights = await Freight.find({
                branch: branch._id
            })
            if (applications.length || financingPartners.length || freights.length) {
                errors.push(`Branch ${branch.name} currently in use.`)
            }
            else {
                await Branch.findByIdAndDelete(branch._id)
            }
        }
    }))

    return errors
}

schema.statics.checkChildren = async function(data) {
    const { Branch, Application, FinancingPartner, Freight } = connection.models
    
    const branches = await Branch.find({
        company: data._id
    })

    const branchInUseArr = await Promise.all(branches.map(async (branch) => {
        const applications = await Application.find({
            'vehiclePurchased.branch': branch._id
        })
        const financingPartners = await FinancingPartner.find({
            branch: branch._id
        })
        const freights = await Freight.find({
            branch: branch._id
        })

        return Boolean(applications.length || financingPartners.length || freights.length)
    }))
    if (branchInUseArr.some((e) => e === true)) {
        throw new Error('Company branch currently in use.')
    }
}

schema.statics.deleteNested = async function(data) {
    const { Branch } = connection.models
    
    const branches = await Branch.find({
        company: data._id
    })

    await Promise.all(branches.map(async (branch) => {
        await Branch.findByIdAndDelete(branch._id)
    }))
}

schema.statics.search = {
    default: function(search) {
        const searchAttributes = [
            'name',
            'email',
            'mobile',
            'telephone',
            'branches'
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
    modelName: 'Company'
})

module.exports = model