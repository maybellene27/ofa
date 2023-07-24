const { authorize } = require('../config/auth')
const application = require('../services/application')
const bankApplication = require('../services/bankApplication')
const app = require('../../jobs/applicationAging')

module.exports = (router) => {
    router.route(`/application/status/:_id/recommend`)
        .patch(
            authorize,
            application.set('recommended')
        )

    router.route(`/application/status/:_id/deleteRecommend`)
        .patch(
            authorize,
            bankApplication.deleteBankApplications
        )

    router.route(`/application/status/:_id/recommendSendMail`)
        .patch(
            authorize,
            application.recommendSendMail
        )

    router.route(`/application/status/:_id/return`)
        .patch(
            authorize,
            application.return
        )
    
    router.route(`/application/status/:_id/approve`)
        .patch(
            authorize,
            application.set('approved')
        )
    router.route(`/application/status/:_id/cancel`)
        .patch(
            authorize,
            application.set('cancelled')
        )
    router.route(`/application/status/:_id/unreleased`)
        .patch(
            authorize,
            application.set('unreleased')
        )
    router.route(`/application/status/:_id/reject`)
        .patch(
            authorize,
            application.set('rejected')
        )
    router.route(`/application/status/:_id/submit`)
        .patch(
            authorize,
            application.set('rejected')
        )
    router.route(`/application/status/:_id/transfer`)
        .patch(
            authorize,
            application.transfer
        ) 
    router.route(`/bankApplication/status/:_id/approve`)
        .patch(
            authorize,
            bankApplication.set('unreleased')
        )
    router.route(`/bankApplication/status/:_id/reject`)
        .patch(
            authorize,
            bankApplication.set('rejected')
        )
    router.route(`/bankApplication/status/:_id/return`)
        .patch(
            authorize,
            bankApplication.return
        )     
    router.route(`/cron`)
        .get(app.approval)
    router.route(`/application/status/:_id/sendmail`)
        .patch(
            authorize,
            application.sendMail
        )
    router.route(`/application/status/:_id/submitSendMail`)
        .patch(
            authorize,
            application.submitSendMail
        )
}