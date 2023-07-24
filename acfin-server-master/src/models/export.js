const { schemaFactory, modelFactory } = require('mongodb-plugin')
const { Schema } = require('mongoose')
const { createdBy, updatedBy, createdByAndUpdatedByLookup } = require('./lib/aggregations')

const {
    padDates = true,
    padTimes = true
} = require('../config/meta')

const aggregationHelper = require('../lib/aggregationHelpers')({
    padDates,
    padTimes
})

const autopopulate = require('mongoose-autopopulate')

const schemaObj = {
    name: {
        type: 'String'
    },
    params: {
        type: Object
    },
    createdBy: {
        type: 'ObjectId',
        ref: 'User'
    },
    updatedBy: {
        type: "ObjectId",
        ref: 'User'
    }
}

const schema = new Schema(schemaObj, {
    timestamps: {
        createdAt: 'dateCreated',
        updatedAt: 'dateUpdated'
    },
    autoCreate: true
})

const addStage = {
    $addFields: {
        createdBy: createdBy,
        updatedBy: updatedBy 
    }
}

const lookupStage = [ ...createdByAndUpdatedByLookup ]

schema.statics.dataView = {
    default: [
        ...aggregationHelper.to12HourString({
            fieldName: 'dateCreated'
        }),
        ...aggregationHelper.to12HourString({
            fieldName: 'dateUpdated'
        }),
        {
            $match: {
                _status: {
                    $ne: 'deleted'
                }
            }
        },
        ...lookupStage,
        addStage
    ]
}


schema.statics.search = {
    default: function (search) {
        const searchAttributes = [ 'name' ]
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
    modelName: 'Export'
})

module.exports = model