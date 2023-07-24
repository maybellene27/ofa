/* eslint-disable prefer-destructuring */
/* eslint-disable new-cap */
// False positive. Path is not given by the user.
/* eslint-disable security/detect-non-literal-fs-filename */
const { RequestError } = require('error-handler')
const sanitize = require('mongo-sanitize')
const initializeFiler = require("filer")
const models = require('../models')
const { setValueInArrayInNestedObject, getValueInArrayInNestedObject, getValueInFieldfOfNestedObject } = require('../lib/utils')
const fs = require('fs').promises
const _ = require('lodash')

module.exports = () => ({
    addDestinationByModel: (modelName) => async (req, res, next) => {
        try {
            const { _id } = req.params
            const model = models[`${modelName}`]
            if(!model) {
                throw new Error(`Model ${modelName} not found.`)
            }
            const doc = await model.findOne({
                _id: sanitize(_id)
            })
            if(!doc) {
                throw new Error('Document not found.')
            }

            req.session.oldUserType = req.session.userType
            req.session.oldUserIDValue = req.session.userID.value
            req.session.userType = doc.constructor.modelName
            req.session.userID.value = _id
            next()
        }
        catch (err) {
            next(new RequestError(400, err.message))
        }       
    },
    addDestination: async (req, res, next) => {
        try {
            const { _id } = req.params

            const userModel = models.user
            const userDoc = await userModel.findOne({
                _id
            })
            if(!userDoc) {
                throw new Error('User not found.')
            }
            req.session.oldUserType = req.session.userType
            req.session.oldUserIDValue = req.session.userID.value
            req.session.userType = userDoc.userType
            req.session.userID.value = userDoc._id
            next()
        }
        catch (err) {
            next(new RequestError(400, err.message))
        }
    },
    model: {
        post: (modelName) => async (req, res, next) => {
            try {
                const { _id: documentId, _fieldName } = req.params

                req.session.userType = req.session.oldUserType
                req.session.userID.value = req.session.oldUserIDValue
                delete req.session.oldUserType
                delete req.session.oldUserIDValue

                let { user: userId } = req.session
                userId = userId ? userId : req.user
                const id = userId

                const userModel = models.user
                const userDoc = await userModel.findOne({
                    _id: sanitize(id)
                })
                const model = models[`${modelName}`]

                if(!model) {
                    throw new Error('Model not found.')
                }

                const doc = await model.findOne({
                    _id: sanitize(documentId)
                }).select('+_revision')

                if(!userDoc) {
                    throw new Error('User not found.')
                }
                if(!doc) {
                    throw new Error('Document not found.')
                }

                const { firstName, middleName, lastName } = userDoc
                const files = model.upload[`${_fieldName}`].maxCount === 1 ? req.files[0] : req.files

                if(model.fileMapping && model.fileMapping[`${_fieldName}`]) {
                    _.set(doc, model.fileMapping[`${_fieldName}`].join('.'), files);
                }
                else {
                    doc[`${_fieldName}`] = files
                }

                doc._revision = {
                    author: {
                        userModel: models.user.constructor.modelName,
                        doc: userId
                    },
                    description: `Uploaded the files for ${_fieldName} by ${firstName}${middleName ? ` ${middleName}` : ''} ${lastName}.`
                }

                await doc.save()

                const entry = await model.findOne({
                    _id: sanitize(documentId)
                })
                res.status(200).json({
                    entry
                })
            }
            catch (err) {
                next(new RequestError(400, err.message))
            }
        },
        get: (modelName) => async (req, res, next) => {
            try {
                const { _id, _fileName, _fieldName } = req.params
                const { parse = 'true' } = req.query

                const model = models[`${modelName}`]
                if(!model) {
                    throw new Error(`Model ${modelName} not found.`)
                }

                const doc = await model.findOne({
                    _id: sanitize(_id)
                })
                if(!doc) {
                    throw new Error('Document not found.')
                }
                
                // eslint-disable-next-line init-declarations
                let attachment;
                if(model.fileMapping && model.fileMapping[`${_fieldName}`]) {
                    const fileMapping = [ ...model.fileMapping[`${_fieldName}`] ]
                    attachment = getValueInFieldfOfNestedObject(doc, fileMapping)
                }
                else {
                    attachment = doc[`${_fieldName}`]
                }

                if(Array.isArray(attachment)) {
                    if(attachment.length === 0) {
                        throw new Error('File not found')
                    }
                    attachment = attachment.find((document) => document.filename === _fileName)
                }
                if(!attachment && !Array.isArray(attachment)) {
                    throw new Error('File not found')
                }

                const { path, mimetype } = attachment

                const data = await fs.readFile(path)
                if(parse === 'true') {
                    const base64String = `data:${mimetype};base64,${Buffer.from(data).toString('base64')}`;
                    res.status(200).json({
                        file: base64String
                    })
                }
                else {
                    res.status(200).json({
                        file: data
                    })
                }

                // const fileBin = await filer.file.read(path, mimetype)
                // res.contentType(mimetype)
                // res.status(200).send(fileBin)
            }
            catch (err) {
                next(new RequestError(400, err.message))
            }
        }
    },
    array: {
        post: (modelName) => async (req, res, next) => {
            try {
                const { _id: documentId, _fieldName, _index } = req.params

                req.session.userType = req.session.oldUserType
                req.session.userID.value = req.session.oldUserIDValue
                delete req.session.oldUserType
                delete req.session.oldUserIDValue

                let { user: userId } = req.session
                userId = userId ? userId : req.user
                const id = userId

                const userModel = models.user
                const userDoc = await userModel.findOne({
                    _id: sanitize(id)
                })
                const model = models[`${modelName}`]

                if(!model) {
                    throw new Error('Model not found.')
                }

                let doc = await model.findOne({
                    _id: sanitize(documentId)
                }).select('+_revision')

                if(!userDoc) {
                    throw new Error('User not found.')
                }
                if(!doc) {
                    throw new Error('Document not found.')
                }
                if(!model.fileMapping[`${_fieldName}`]) {
                    throw new Error(`No file mapping for ${_fieldName}`)
                }

                const { firstName, middleName, lastName } = userDoc
                const files = model.upload[`${_fieldName}`].maxCount === 1 ? req.files[0] : req.files
                if(model.fileMapping[`${_fieldName}`]) {
                    const fileMapping = [ ...model.fileMapping[`${_fieldName}`] ]
                    const fieldName = fileMapping.pop()
                    const updatedDoc = setValueInArrayInNestedObject(doc, fileMapping, files, Number(_index), fieldName)
                    doc = _.merge(doc, updatedDoc)
                }
                else {
                    doc[`${_fieldName}`] = files
                }
                doc._revision = {
                    author: {
                        userModel: models.user.constructor.modelName,
                        doc: userId
                    },
                    description: `Uploaded the files for ${_fieldName} by ${firstName}${middleName ? ` ${middleName}` : ''} ${lastName}.`
                }

                await doc.save()

                const entry = await model.findOne({
                    _id: sanitize(documentId)
                })
                res.status(200).json({
                    entry
                })
            }
            catch (err) {
                next(new RequestError(400, err.message))
            }
        },
        get: (modelName) => async (req, res, next) => {
            try {
                const { _id, _fileName, _fieldName, _index } = req.params
                const { parse = 'true' } = req.query

                const model = models[`${modelName}`]
                if(!model) {
                    throw new Error(`Model ${modelName} not found.`)
                }

                const doc = await model.findOne({
                    _id: sanitize(_id)
                })
                if(!doc) {
                    throw new Error('Document not found.')
                }
                if(!model.fileMapping[`${_fieldName}`]) {
                    throw new Error(`No file mapping for ${_fieldName}`)
                }

                // eslint-disable-next-line init-declarations
                let attachment;
                if(model.fileMapping[`${_fieldName}`]) {
                    const fileMapping = [ ...model.fileMapping[`${_fieldName}`] ]
                    const fieldInArray = fileMapping.pop()
                    attachment = getValueInArrayInNestedObject(doc, fileMapping, fieldInArray, _index)
                }
                else {
                    attachment = doc[`${_fieldName}`]
                }
                if(Array.isArray(attachment)) {
                    if(attachment.length === 0) {
                        throw new Error('File not found')
                    }
                    attachment = attachment.find((document) => document.originalname === _fileName)
                }
                if(!attachment && !Array.isArray(attachment)) {
                    throw new Error('File not found')
                }

                const { path, mimetype } = attachment

                const data = await fs.readFile(path)
                if(parse === 'true') {
                    const base64String = `data:${mimetype};base64,${Buffer.from(data).toString('base64')}`;
                    res.status(200).json({
                        file: base64String
                    })
                }
                else {
                    res.status(200).json({
                        file: data
                    })
                }

            }
            catch (err) {
                next(new RequestError(400, err.message))
            }
        }
    },
    uploadMiddleware: (modelName) => async (req, res, next) => {
        try {
            const { _id, _fieldName } = req.params
            const model = models[`${modelName}`]

            if(!model) {
                throw new Error(`Model ${modelName} not found.`)
            }

            const doc = await model.findOne({
                _id: sanitize(_id)
            })

            if(!doc) {
                throw new Error('Document not found.')
            }
            if(!model.upload[`${_fieldName}`]) {
                throw new Error('Upload configuration not found.')
            }

            const { uploadFile } = initializeFiler(model.upload[`${_fieldName}`])
            const { maxCount } = model.upload[`${_fieldName}`]
            await uploadFile('array')(_fieldName, maxCount)(req, res, next)
        }
        catch(err) {
            next(new RequestError(400, err.message))
        }
    }
})