const { canSoftDelete } = require('../config')
const { authorize } = require('../config/auth')
const crud = require('../services/crud')({
    canSoftDelete
})
const collections = [
    'location',
    'financingPartner',
    'vehicle',
    'application',
    'company',
    'branch',
    'bankApplication'
]

module.exports = (router) => {
    collections.forEach((collection) => {
        router.route(`/${collection}`)
            .post(
                authorize,
                crud.create(collection)
            )
            .get(
                authorize,
                crud.viewAll(collection)
            )

        router.route(`/${collection}/:_id`)
            .patch(
                authorize,
                crud.update(collection)
            )
            .get(
                authorize,
                crud.view(collection)
            )
            .delete(
                authorize,
                crud.delete(collection)
            )

        router.route(`/${collection}/:_id/:_operation`)
            .patch(
                authorize,
                crud.operate(collection)
            )
        
        router.route(`/${collection}/multiple/delete`)
            .post(
                authorize,
                crud.deleteMany(collection)
            )
    });
}