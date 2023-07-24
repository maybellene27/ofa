// Rule is needed to be disabled for Mongoose
/* eslint-disable no-invalid-this */
// Rule is needed to be disabled for the ObjectId to be parsed correctly
/* eslint-disable new-cap */
const { Schema } = require('mongoose')
const { schemaFactory, modelFactory } = require('mongodb-plugin')
const autopopulate = require('mongoose-autopopulate')

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
        vehicle: {
            type: "ObjectId",
            ref: "Vehicle",
            required: [
                true,
                'Vehicle is required.'
            ]
        },
        branch: {
            type: [ "ObjectId" ],
            ref: "Branch",
            required: [
                true,
                'Branch is required.'
            ]
        },
        freightCost: {
            type: 'String',
            required: [
                true,
                'Freight cost is required'
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
            $match: {
                _status: {
                    $ne: 'deleted'
                }
            }
        }
    ]
}

schema.statics.search = {
    default: function(search) {
        const searchAttributes = [ 'freightCost' ]
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
    modelName: 'Freight'
})

module.exports = model