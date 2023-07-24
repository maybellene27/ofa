const { authorize } = require('../config/auth')
const initAttachment = require('../services/attachment')

const {
    __homePath,
    maxFileUploadSize
} = require('../config')
const filer = require("filer")({
    dest: 'acfin-files',
    folder: 'acfin-user-files',
    mimeTypes: [
        "image/jpeg", 
        "image/png",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ],
    __homePath,
    maxFileUploadSize
})

const models = [
    'user',
    'company',
    'application',
    'bankApplication'
]

module.exports = (router) => {
    const attachment = initAttachment(filer)
    models.forEach((model) => {
        router.route(`/attachment/${model}/:_id/:_fieldName`)
            .post(
                authorize,
                attachment.addDestinationByModel(model),
                attachment.uploadMiddleware(model),
                attachment.model.post(model)
            )

        router.route(`/attachment/${model}/:_id/:_fieldName/:_fileName`)
            .get(
                authorize,
                attachment.model.get(model)
            )
        
        router.route(`/attachment/${model}/:_discriminator/:_id/:_fieldName`)
            .post(
                authorize,
                attachment.addDestinationByModel(model),
                attachment.uploadMiddleware(model),
                attachment.model.post(model)
            )

        router.route(`/attachment/${model}/:_discriminator/:_id/:_fieldName/:_fileName`)
            .get(
                authorize,
                attachment.model.get(model)
            )

        router.route(`/attachment/array/${model}/:_id/:_fieldName/:_index`)
            .post(
                authorize,
                attachment.addDestinationByModel(model),
                attachment.uploadMiddleware(model),
                attachment.array.post(model)
            )

        router.route(`/attachment/array/${model}/:_id/:_fieldName/:_index/:_fileName`)
            .get(
                authorize,
                attachment.array.get(model)
            )
    })
}