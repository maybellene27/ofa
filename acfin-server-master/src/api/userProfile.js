const userProfile = require('../services/userProfile')

module.exports = (router) => {
    router.route(`/currentUser`)
        .get(userProfile.getCurrentUser())
}