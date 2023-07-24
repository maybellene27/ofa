/* eslint-disable prefer-destructuring */
/* eslint-disable new-cap */
const { RequestError } = require('error-handler')
const { connection } = require('mongoose')
const { ObjectId } = require('mongoose').Types
const sanitize = require('mongo-sanitize')
const models = require('../models')
const exportModel = require('../models/export')
const reportsPipeline = require('../lib/exports')

// eslint-disable-next-line security/detect-unsafe-regex
const sentenceCase = (str) => str.replace(/(?<camelCase>[A-Z])/gu, ' $1')
    .replace(/^./u, (s) => s.toUpperCase())

module.exports = () => ({
    list: (m) => async function (req, res, next) {
        try {
            const { _model: modelParam } = req.params
            const { user } = req.session
            const { reportType, ...params } = req.body
            const _model = modelParam || m
            const model = models[`${_model}`]
            if (!model) {
                throw new Error(`Model ${_model} not found.`)
            }

            if (!reportsPipeline[`${_model}`]) {
                throw new Error('Current Pipeline not for the model')
            }

            if (!reportsPipeline[`${_model}`][`${reportType}`]) {
                throw new Error(`'reportType' does not exist`)
            }

            const pipeline = await reportsPipeline[`${_model}`][`${reportType}`]({ 
                ...params
            })

            let result = await model.aggregate(pipeline)
            
            if (reportType === 'conso') {
                result = result[0]
                const totalBanks = result.total.length
                result.others = result.total.splice((totalBanks - 4) * -1)
                let totalOthers = 0
                for (const other of result.others) {
                    totalOthers += other.total
                }
                result.topFour.push({
                    _id: {
                        bank: 'Others'
                    },
                    total: totalOthers,
                    percent: totalOthers / result.count * 100
                })
                for (const other of result.others) {
                    other.percent = other.total / totalOthers * 100
                }
                delete result.total
            }

            const entry = await model
            if (!entry) {
                throw new Error('Document not found.')
            }
            const userDoc = await models.user.findById(sanitize(user))
            if (!userDoc) {
                throw new Error('No user found.')
            }

            await exportModel.create({
                name: _model,
                params: params,
                createdBy: ObjectId(user),
                updatedBy: ObjectId(user),
                _revision: {
                    author: {
                        userModel: models.user.constructor.modelName,
                        doc: ObjectId(user)
                    },
                    description: `${userDoc.salutation ? `${userDoc.salutation} ` : ''}${userDoc.firstName} ${userDoc.middleName ? `${userDoc.middleName} ` : ''}${userDoc.lastName}${userDoc.suffix ? ` ${userDoc.suffix}` : ''} exported a document from ${sentenceCase(_model)}.`
                }
            })

            res.status(200).json({
                entry,
                result
            })
        }
        catch (err) {
            next(new RequestError(400, err.message))
        }
    },
    create: (m) => async function (req, res, next) {
        try {
            const { _id, _model: modelParam } = req.params
            const { user } = req.session
            const { reportType, params } = req.body
            const _model = modelParam || m
            const model = models[`${_model}`]
            if (!model) {
                throw new Error(`Model ${_model} not found.`)
            }

            if (!reportsPipeline[`${_model}`]) {
                throw new Error('Current Pipeline not for the model')
            }

            if (!reportsPipeline[`${_model}`][`${reportType}`]) {
                throw new Error(`'reportType' does not exist`)
            }

            const pipeline = reportsPipeline[`${_model}`][`${reportType}`]({ 
                ...params, 
                _id 
            })

            const result = await model.aggregate(pipeline)

            const entry = await model.findById(sanitize(_id))
            if (!entry) {
                throw new Error('Document not found.')
            }
            const userDoc = await models.user.findById(sanitize(user))
            if (!userDoc) {
                throw new Error('No user found.')
            }

            await exportModel.create({
                name: _model,
                params: params,
                createdBy: ObjectId(user),
                updatedBy: ObjectId(user),
                _revision: {
                    author: {
                        userModel: models.user.constructor.modelName,
                        doc: ObjectId(user)
                    },
                    description: `${userDoc.salutation ? `${userDoc.salutation} ` : ''}${userDoc.firstName} ${userDoc.middleName ? `${userDoc.middleName} ` : ''}${userDoc.lastName}${userDoc.suffix ? ` ${userDoc.suffix}` : ''} exported a document from ${sentenceCase(_model)}.`
                }
            })

            res.status(200).json({
                entry,
                result
            })
        }
        catch (err) {
            next(new RequestError(400, err.message))
        }
    },
    createAuditLog: async (req, res, next) => {
        try {
            const { user, userRole } = req.session
            const { start = 0, count = 1000, search, sortBy = 'date', asc = 1 } = req.query
            const { params, toExport = false } = req.body
            const { ProjectPatches } = connection.models
            const pipeline = reportsPipeline.auditLog({
                userRole,
                ...params
            })
            
            if (search) {
                pipeline.push({
                    $match: {
                        $or: [
                            {
                                'actionsPerformed': {
                                    $regex: search,
                                    $options: 'i' 
                                }
                            },
                            {
                                'performedBy': {
                                    $regex: search,
                                    $options: 'i' 
                                } 
                            },
                            {
                                'date': {
                                    $regex: search,
                                    $options: 'i' 
                                }
                            }
                        ]
                    }
                })
            }

            let result = await ProjectPatches.aggregate([
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
                                    [`${sortBy}`]: parseInt(asc, 10) === 1 ? 1 : -1
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
            result = result[0]
            result.total = result.total.length > 0 
                ? result.total[0].total
                : 0

            if (toExport) {
                const userDoc = await models.user.findById(sanitize(user))
                if (!userDoc) {
                    throw new Error('No user found.')
                }

                await exportModel.create({
                    name: 'auditLog',
                    params,
                    createdBy: ObjectId(user),
                    updatedBy: ObjectId(user),
                    _revision: {
                        author: {
                            userModel: models.user.constructor.modelName,
                            doc: ObjectId(user)
                        },
                        description: `${userDoc.salutation ? `${userDoc.salutation} ` : ''}${userDoc.firstName} ${userDoc.middleName ? `${userDoc.middleName} ` : ''}${userDoc.lastName}${userDoc.suffix ? ` ${userDoc.suffix}` : ''} exported Audit Log.`
                    }
                })
            }

            res.status(200).json({
                result: result.entries,
                total: result.total
            })
        }
        catch (err) {
            next(new RequestError(400, err.message))
        }
    }
})