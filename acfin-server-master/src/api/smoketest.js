const { test, emailtest, usercount } = require('../services/smoketest')

module.exports = (router) => {
    router.route(`/utilities/test`)
        .get(test)

    router.route(`/utilities/emailtest`)
        .get(emailtest)

    router.route(`/utilities/usercount`)
        .get(usercount)
}