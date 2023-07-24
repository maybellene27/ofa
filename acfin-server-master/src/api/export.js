const { authorize } = require('../config/auth')
const exportDocument = require('../services/export')()

const collections = [
    'financingPartner',
    'application',
    'bankApplication'
]

module.exports = (router) => {
    collections.forEach((collection) => {
        router.route(`/export/${collection}`)
            .post(
                authorize,
                exportDocument.createAuditLog
            )

        router.route(`/export/report/${collection}`)
            .post(
                authorize,
                exportDocument.list(collection)
            )

        router.route(`/export/${collection}/:_id`)
            .post(
                authorize,
                exportDocument.create(collection)
            )      
    })

}