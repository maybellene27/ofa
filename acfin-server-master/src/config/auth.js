const {
    dbURL,
    smtpAuth,
    appData,
    pathToUse,
    authURL,
    protocol,
    domain,
    secret,
    cookieMaxAge,
    disableGuestAutoCreate
} = require('./index')
const userModel = require('../models/user')
const {
    usernameRegex,
    passwordRegex,
    guestUserTemplate,
    usernamePath,
    padDates,
    padTimes
} = require('./meta')
const privileges = require('./privileges')
const defaultAccessObject = require('./lib/generateDefaultConfig')(privileges)

const auth = require('maroon-auth')({
    uri: dbURL,
    configUri: authURL,
    settings: {
        smtpAuth,
        appData,
        emailTemplatePathToUse: pathToUse,
        protocol,
        domain,
        secret,
        cookieMaxAge,
        minUsernameLength: 6,
        maxUsernameLength: Infinity,
        minPasswordLength: 10,
        maxPasswordLength: Infinity,
        usernameValidation: usernameRegex,
        passwordValidation: passwordRegex,
        usernameValidationDescription: 'a valid e-mail address',
        passwordValidationDescription: 'a sequence of ten (10) or more characters',
        saltLength: 10,
        userLockoutTimeout: 180000,
        homepage: `${protocol}://${domain}`,
        showVerifyEmailButton: false,
        maxFailedLogins: 5,
        showLockoutRemaining: true,
        // maxSessions: 1,
        uniqueEmail: false,
        usernamePath,
        beforeLogin: {
            userActive: true,
            emailVerified: false
        },
        guestUserTemplate,
        padDates,
        padTimes,
        verboseAuthorizeMessages: true,
        viewCreatedUsers: true,
        disableGuestAutoCreate
    },
    userModel,
    privileges,
    defaultAccessObject
})

module.exports = auth