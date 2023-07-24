// Rule is needed to be disabled for Mongoose
/* eslint-disable no-invalid-this */
// Rule is needed to be disabled for the ObjectId to be parsed correctly
/* eslint-disable new-cap */
const { Schema } = require('mongoose')
const { ObjectId } = require("mongoose").Schema.Types
const { schemaFactory, modelFactory } = require('mongodb-plugin')
const autopopulate = require('mongoose-autopopulate')

const schema = new Schema({
    code: {
        type: 'String',
        required: [
            true,
            'Code is required'
        ]
    },
    name: {
        type: 'String',
        required: [
            true,
            'Name is required'
        ]
    },
    type: {
        enum: [
            "region",
            "province",
            "town",
            "barangay" 
        ],
        type: 'String',
        required: [
            true,
            'Type is required'
        ]
    },
    jurisdiction: {
        type: ObjectId,
        ref: 'Location',
        default: null
    },
    order: {
        type: Number
    }
})


const defaultAggregation = [
    {
        $sort: {
            order: 1,
            name: 1
        }
    },
    {
        $project: {
            _status: 0
        }
    }
]

schema.statics.dataView = {
    default: [ ...defaultAggregation ]
}

schema.statics.listAggregate = defaultAggregation.concat([])

schema.statics.readAggregate = defaultAggregation.concat([])

schema.statics.search = {
    default: function(search) {
        const searchAttributes = [
            'name',
            'code'
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
    code: 1,
    type: 1
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
    modelName: 'Location'
})

module.exports = model