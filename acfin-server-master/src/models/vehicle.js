// Rule is needed to be disabled for Mongoose
/* eslint-disable no-invalid-this */
// Rule is needed to be disabled for the ObjectId to be parsed correctly
/* eslint-disable new-cap */
const { Schema, connection } = require('mongoose')
const { schemaFactory, modelFactory } = require('mongodb-plugin')
const autopopulate = require('mongoose-autopopulate')
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
        brand: {
            type: 'String',
            enum: brands,
            required: [
                true,
                'Brand is required'
            ]
        },
        model: {
            type: 'String',
            required: [
                true,
                'Model is required'
            ]
        },
        variant: {
            type: 'String',
            required: [
                true,
                'Variant is required'
            ]
        },
        year: {
            type: 'String',
            required: [
                true,
                'Year is required'
            ]
        },
        price: {
            type: 'String',
            required: [
                true,
                'Price is required'
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

schema.pre('save', (next) => {
    next()
})

schema.pre('remove', (next) => {
    next()
})

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
            $lookup: {
                from: 'freights',
                let: {
                    "vehicleId": "$_id"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    "$vehicle",
                                    "$$vehicleId"
                                ]
                            }
                        }
                    }
                ],
                as: 'freights'
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
                            '$brand',
                            currentUser.brand
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
            match
        ]
    }
}

schema.statics.children = async function(data, vehicle, doc) {
    const { Freight } = connection.models
    const { _id, ...info } = data
    if (_id) {
        const result = await Freight.findById(_id)

        result._revision = {
            author: {
                userModel: 'User',
                doc: doc._id
            },
            description: `Modified Freight document.`
        }

        const updatedResult = Object.assign(result, {
            ...info
        })

        await updatedResult.save()
    }
    else {
        await Freight.create({
            ...info,
            vehicle,
            createdBy: doc._id,
            updatedBy: doc._id,
            _revision: {
                author: {
                    userModel: 'User',
                    doc: doc._id
                },
                description: `Created a document for Freight by ${doc.firstName} ${doc.middleName ? `${doc.middleName}` : ''} ${doc.lastName}.`
            }
        })
    }
}

schema.statics.childrenCleanup = async function(ids, vehicle) {
    const { Freight, Application } = connection.models
    
    const results = await Freight.find({
        vehicle
    })
    const errors = []
    await Promise.all(results.map(async (result) => {
        if (!ids.includes(result._id.toString())) {
            //check
            const applications = await Application.find({
                'vehiclePurchased.variant': result._id
            })
            if (applications.length) {
                errors.push(`Vehicle currently in use.`)
            }
            else {
                await Freight.findByIdAndDelete(result._id)
            }
        }
    }))

    return errors
}

schema.statics.checkChildren = async function(data) {
    const { Application } = connection.models
    
    const applications = await Application.find({
        'vehiclePurchased.variant': data._id
    })
    if (applications.length) {
        throw new Error('Vehicle currently in use.')
    }
}

schema.statics.search = {
    default: function(search) {
        const searchAttributes = [
            'brand',
            'model',
            'variant',
            'year' 
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
    modelName: 'Vehicle'
})

module.exports = model