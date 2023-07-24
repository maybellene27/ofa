/* eslint-disable no-nested-ternary */
/* eslint-disable new-cap */
const { RequestError } = require('error-handler')
const { formatQuery } = require('../lib/utils')
const models = require('../models')
const { Types } = require('mongoose')
const { ObjectId } = Types

// eslint-disable-next-line security/detect-unsafe-regex
const sentenceCase = (str) => str.replace(/(?<camelCase>[A-Z])/gu, ' $1')
    .replace(/^./u, (s) => s.toUpperCase())

const errorMessage = (error, _model) => {
    let errMessage = error.message
    if (String(error.message).includes('E11000')) {
        errMessage = `Validation Error: ${sentenceCase(_model)} already exists.`
    }
    if (String(error.message).includes('validation')) {
        const messageArr = errMessage.split(':')
        const messages = messageArr.splice(-1)
        errMessage = `Validation Error: ${messages[0]}`
    }
    if (String(error.message).includes('Cast')) {
        const [ , fieldName ] = errMessage.split(':')
        errMessage = `Validation Error: ${fieldName}`
    }
    if (String(error.message).includes('set property')) {
        errMessage = `Validation Error: Please enter a valid ObjectID to update.`
    }
    return errMessage
}

const modelExists = (_model) => {
    if (!models[`${_model}`]) {
        throw new Error(`Collection named '${_model}' does not exist.`)
    }
    return models[`${_model}`]
}

module.exports = (settings) => ({
    create: (m) => async function (req, res, next) {
        try {
            const { _model: modelParam } = req.params
            const { ...info } = req.body
            const _model = modelParam || m
            const model = modelExists(_model)
            let { user } = req.session
            user = user ? user : req.user
    
            const createdByDoc = await models.user.findById(user)
            const indexes = await model.listIndexes()
            let fields = indexes.map((index) => {
                if(index.unique) {
                    return Object.keys(index.key)
                }
                return []
            })
            fields = fields.flat()
                
            const uniqueConstraint = {
            }
            for(const field of fields) {
                uniqueConstraint[`${field}`] = info[`${field}`]
            }
            const check = await model.findOne({
                ...uniqueConstraint
            })
            if (fields.length) {
                if (check && check._status === 'active') {
                    throw new Error('Document already exists.')
                }
        
                if (check && check._status === 'deleted') {
                    await model.deleteOne(check)
                }
            }
            const entry = await model.create({
                ...info,
                createdBy: ObjectId(createdByDoc._id),
                updatedBy: ObjectId(createdByDoc._id),
                _revision: {
                    author: {
                        userModel: models.user.constructor.modelName,
                        doc: ObjectId(createdByDoc._id)
                    },
                    description: `Created a document for ${sentenceCase(_model)} by ${createdByDoc.firstName} ${createdByDoc.middleName ? `${createdByDoc.middleName}` : ''} ${createdByDoc.lastName}.`
                }
            })
    
            if (!entry) {
                throw new Error(`Error in creating ${sentenceCase(_model)}.`)
            }

            if(model.children && info.children) {
                await Promise.all(info.children.map(async (child) => {
                    await model.children(child, entry._id, createdByDoc)
                }))
            }
            if (model.action) {
                await model.action(entry)
            }

            res.status(201).json({
                message: `Created an entry for ${sentenceCase(_model)}.`,
                entry
            })
        }
            
        catch(error) {
            const { _model } = req.params
            next(new RequestError(400, errorMessage(error, _model)))
        }
    },
    view: (m) => async (req, res, next) => {
        try {
            const { _model: modelParam, _id } = req.params
            const _model = modelParam || m

            const model = modelExists(_model)
            const { dataview = 'default' } = req.query

            const entry = await model.aggregate([
                {
                    $match: {
                        _id: ObjectId(_id),
                        _status: {
                            $ne: 'deleted'
                        }
                    }
                },
                {
                    $project: {
                        _revision: 0
                    }
                },
                ...model.dataView[`${dataview}`]
            ]).allowDiskUse(true)

            if(entry.length === 0) {
                throw new Error(`${sentenceCase(_model)} is not found.`)
            }

            res.status(200).json({
                entry: entry[0]
            })
        }
        catch(error) {
            const { _model } = req.params

            next(new RequestError(400, errorMessage(error, _model)))
        }
    },
    viewAll: (m) => async (req, res, next) => {
        try {
            const { _model: modelParam } = req.params
            const _model = modelParam || m
            const model = modelExists(_model)
            let query = {
            }
            
            let pipeline = []

            const {
                key = null,
                value = null,
                advancedQuery,
                start = 0,
                count = 100000,
                sortBy = '_id',
                asc = 1,
                total = false,
                dataview = 'default',
                search
            } = req.query

            if(!model.dataView[`${dataview}`]) {
                throw new Error(`Data view is not defined in the ${sentenceCase(_model)} model.`)
            }

            let dataViewQuery = model.dataView[`${dataview}`] || []
            if (typeof model.dataView[`${dataview}`] === 'function') {
                dataViewQuery = await model.dataView[`${dataview}`](req.session)
            }

            if(key !== null && value !== null) {
                query = {
                    [key]: value
                }
            }
            else if(advancedQuery) {
                query = formatQuery(JSON
                    .parse(decodeURIComponent(advancedQuery)))
            }

            pipeline = pipeline
                .concat([
                    ...dataViewQuery,
                    {
                        $match: query
                    }
                ])

            if (search) {
                const defaultSearch = model.search ? model.search.default(search) : []
                pipeline = pipeline.concat([ ...defaultSearch ])
            }

            let entries = await model.aggregate([
                {
                    $facet: {
                        entries: [
                            ...pipeline,
                            {
                                $project: {
                                    _revision: 0
                                }
                            },
                            {
                                $sort: {
                                    [sortBy]: parseInt(asc, 10) === 1 ? 1 : -1
                                }
                            },
                            {
                                $skip: parseInt(start, 10)
                            },
                            {
                                $limit: parseInt(count, 10)
                            }
                        ],
                        total: [
                            ...pipeline,
                            {
                                $count: 'total'
                            }
                        ]
                    }
                }
            ]).allowDiskUse(true)
            // Need to disable line to assign Mongoose data to variable
            // eslint-disable-next-line prefer-destructuring
            entries = entries[0]
            entries.total = entries.total.length > 0 
                ? entries.total[0].total
                : 0

            res.status(200).json(total ? {
                total: entries.total
            } : {
                ...entries
            })
        }
        catch(error) {
            const { _model } = req.params

            next(new RequestError(400, errorMessage(error, _model)))
        }
    },
    update: (m) => async (req, res, next) => {
        try {
            const { _model: modelParam, _id } = req.params
            const _model = modelParam || m
            const model = modelExists(_model)
            const { ...updateInfo } = req.body

            let { user } = req.session
            user = user ? user : req.user

            const result = await model.findById(_id)

            if (result._status === 'deleted') {
                throw new Error(`Cannot update deleted documents.`)
            }

            if (!result) {
                throw new Error(`${sentenceCase(_model)} is not found.`)
            }

            const indexes = await model.listIndexes()
            let fields = indexes.map((index) => {
                if(index.unique) {
                    return Object.keys(index.key)
                }
                return []
            })
            fields = fields.flat()
            
            const uniqueConstraint = {
            }
            for(const field of fields) {
                uniqueConstraint[`${field}`] = updateInfo[`${field}`]
            }

            const check = await model.findOne({
                ...uniqueConstraint
            })
            if (check && check._status === 'deleted') {
                await model.deleteOne(check)
            }
            const updatedResult = Object.assign(result, {
                ...updateInfo
            })

            updatedResult._revision = {
                author: {
                    userModel: models.user.constructor.modelName,
                    doc: ObjectId(user)
                },
                description: `Modified ${sentenceCase(_model)} document.`
            }

            await updatedResult.save()

            const createdByDoc = await models.user.findById(user)
            const errors = []
            if(model.children && model.childrenCleanup && updateInfo.children) {
                errors.push(...await model.childrenCleanup(updateInfo.children.map((child) => child._id), updatedResult._id))
                await Promise.all(updateInfo.children.map(async (child) => {
                    await model.children(child, updatedResult._id, createdByDoc)
                }))
            }
            if (model.action) {
                await model.action(updatedResult)
            }
            res.status(200).json({
                message: `Record has been successfully updated${errors.length ? ` with exceptions: ${errors.join(', ')}` : '.'}`,
                updatedResult
            })
        }
        catch(error) {
            const { _model } = req.params
            next(new RequestError(400, errorMessage(error, _model)))
        }
    },
    delete: (m) => async (req, res, next) => {
        try {
            const { _model: modelParam, _id } = req.params
            const _model = modelParam || m
            const model = modelExists(_model)

            let { user } = req.session
            user = user ? user : req.user

            if(settings.canSoftDelete) {
                const softDeleteData = await model.findById(_id)
                if(!softDeleteData) {
                    throw new Error(`${sentenceCase(_model)} is not found.`)
                }

                if(softDeleteData._status === 'deleted') {
                    throw new Error(`${sentenceCase(_model)} is already deleted.`)
                }

                if(softDeleteData._status === 'inactive') {
                    throw new Error(`Cannot delete inactive documents.`)
                }

                softDeleteData._status = 'deleted'
                softDeleteData._revision = {
                    author: {
                        userModel: models.user.constructor.modelName,
                        doc: ObjectId(user)
                    },
                    description: `Flagged this ${sentenceCase(_model)} document as 'deleted'.`
                }

                if (model.checkChildren) {
                    await model.checkChildren(softDeleteData)
                }
                
                if (model.deleteNested) {
                    model.deleteNested(softDeleteData)
                }

                await softDeleteData.save({ 
                    validateBeforeSave: false 
                })

                res.status(200).json({
                    message: `${sentenceCase(_model)} has been deleted.`,
                    softDeleteData
                })
            }
            else {
                const hardDeleteData = await model.findById(_id)

                if(!hardDeleteData) {
                    throw new Error(`${sentenceCase(_model)} is not found.`)
                }

                hardDeleteData._revision = {
                    author: {
                        userModel: models.user.constructor.modelName,
                        doc: ObjectId(user)
                    },
                    description: `Deleted ${sentenceCase(_model)} document from the database.`
                }

                await hardDeleteData.save({ 
                    validateBeforeSave: false 
                })

                await hardDeleteData.remove()
    
                res.status(200).json({
                    message: `${sentenceCase(_model)} has been successfully deleted from the database.`,
                    hardDeleteData 
                })
            }
        }
        catch(error) {
            const { _model } = req.params
            next(new RequestError(400, errorMessage(error, _model)))
        }
    },
    deleteMany: (m) => async (req, res, next) => {
        try {
            const { _model: modelParam } = req.params
            const _model = modelParam || m
            const model = modelExists(_model)
            const { ids } = req.body
            
            if(!ids) {
                throw new Error('Please select a record to delete.')
            }

            if(!Array.isArray(ids)) {
                throw new Error(`'Delete many' only accepts an array.`)
            }

            if(ids.length === 0) {
                throw new Error('There are no records to delete.')
            }

            const multipleDeleteData = await model.find({
                _id: {
                    $in: ids
                }
            })

            if(multipleDeleteData.length !== ids.length) {
                throw new Error(`Some record from ${sentenceCase(_model)} selected is not found.`)
            }

            if(settings.canSoftDelete) {
                let messages = multipleDeleteData.map(async (data) => {
                    try{
                        if (data._status === 'inactive') {
                            throw new Error('Cannot delete an inactive document.')
                        }

                        data._status = 'deleted'

                        data._revision = {
                            author: {
                                userModel: models.user.constructor.modelName,
                                doc: ObjectId(req.session.user)
                            },
                            description: `Flagged this ${sentenceCase(_model)} document as 'deleted'.`
                        }

                        if (model.checkChildren) {
                            await model.checkChildren(data)
                        }

                        if (model.deleteNested) {
                            model.deleteNested(data)
                        }

                        await data.save()

                        let message = `${sentenceCase(_model)} has been deleted.`

                        if(data.name) {
                            message = `${sentenceCase(_model)} named ${data.name} has been deleted.`
                        }

                        return {
                            message: message,
                            deleted: true
                        }
                    }
                    catch(err) {
                        return {
                            message: err.message,
                            deleted: false
                        }
                    }
                })
                messages = await Promise.all(messages)
                const errors = messages.filter((message) => message.deleted === false)
                const successes = messages.filter((message) => message.deleted === true)
                const errMessages = errors.map((error) => error.message)
                const successMessages = successes.map((error) => error.message)

                const deletedCount = multipleDeleteData.length - errors.length

                let message = `${sentenceCase(_model)}s have been deleted.`

                if(deletedCount < 2) {
                    message = `${sentenceCase(_model)} has been deleted.`
                }
                
                if(errors.length === 0) {
                    res.status(200).json({
                        entry: {
                            deletedCount,
                            message: message
                        }
                    })
                }
                else {
                    throw new RequestError(400, errMessages.join(' '), {
                        errors: errMessages,
                        successes: successMessages
                    })
                }
            }
            else {
                let messages = multipleDeleteData.map(async (data) => {
                    try {
                        data._revision = {
                            author: {
                                userModel: models.user.constructor.modelName,
                                doc: ObjectId(req.session.user)
                            },
                            description: `Deleted ${sentenceCase(_model)} document from the database.`
                        }

                        await data.save({ 
                            validateBeforeSave: false 
                        })

                        let message = `${sentenceCase(_model)} has been successfully deleted from the database.`

                        if(data.name) {
                            message = `${sentenceCase(_model)} named ${data.name} has been successfully deleted from the database.`
                        }

                        await data.remove()

                        return {
                            message: message,
                            deleted: true
                        }
                    } 
                    catch(err) {
                        return {
                            message: err.message,
                            deleted: false
                        }
                    }
                })

                messages = await Promise.all(messages)
                const errors = messages.filter((message) => message.deleted === false)
                const errMessages = errors.map((error) => error.message)
                const successes = messages.filter((message) => message.deleted === true)
                const successMessages = successes.map((error) => error.message)

                const deletedCount = multipleDeleteData.length - errors.length

                let message = `${sentenceCase(_model)}s have been successfully deleted from the database.`

                if(deletedCount < 2) {
                    message = `${sentenceCase(_model)} has been successfully deleted from the database.`
                }

                if(errors.length === 0) {
                    res.status(200).json({
                        entry: {
                            deletedCount,
                            message: message
                        }
                    })
                }
                else {
                    throw new RequestError(400, errMessages.join(' '), {
                        errors: errMessages,
                        successes: successMessages
                    })
                }
            }
        }
        catch(error) {
            const { _model } = req.params
            next(new RequestError(400, errorMessage(error, _model), {
                errors: error.errors,
                successes: error.successes
            }))
        }
    },
    operate: (m) => async (req, res, next) => {
        try {
            const { _model: modelParam, _id, _operation } = req.params
            const _model = modelParam || m
            const model = modelExists(_model)

            let { user } = req.session
            user = user ? user : req.user

            const result = await model.findById(_id)

            if (!result) {
                throw new Error(`${sentenceCase(_model)} is not found.`)
            }

            let _status = ''
            if(_operation === 'activate') {
                if(result._status === 'active') {
                    throw new Error(`${sentenceCase(_model)} is already active.`)
                }
                _status = 'active'
            }
            else if(_operation === 'deactivate') {
                if(result._status === 'inactive') {
                    throw new Error(`${sentenceCase(_model)} is already inactive.`)
                }
                _status = 'inactive'
            }
            else if(_operation === 'delete') {
                if(result._status === 'deleted') {
                    throw new Error(`${sentenceCase(_model)} is already deleted.`)
                }
                _status = 'deleted'
            }
            else {
                throw new Error('Invalid operation.')
            }

            const updatedResult = Object.assign(result, {
                _status 
            })

            updatedResult._revision = {
                author: {
                    userModel: models.user.constructor.modelName,
                    doc: ObjectId(user)
                },
                description: `Modified ${sentenceCase(_model)} document.`
            }

            await updatedResult.save()

            res.status(200).json({
                message: `Record has been successfully ${_operation}d.`,
                updatedResult
            })
        }
        catch(error) {
            const { _model } = req.params
            next(new RequestError(400, errorMessage(error, _model)))
        }
    }
})