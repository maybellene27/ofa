const Mailer = require('mailer')
const nodemailer = require('nodemailer')
const nunjucks = require('nunjucks')
const {
    smtpAuth,
    appData,
    pathToUse,
    protocol,
    domain
} = require('../config/index')
module.exports = () => {
    const transporter = new Mailer({
        settings: smtpAuth
    })

    return {
        transporter,
        nodemailer,
        sendEmailVerification: async ({
            username,
            password,
            homepage,
            showVerifyEmailButton = true,
            userObject,
            from = appData.email,
            to,
            // eslint-disable-next-line no-nested-ternary
            subject = appData.hideTitle ? `Email Confirmation` : appData.customSubject ? `[${appData.title}] ${appData.emailConfirmation}` : `[${appData.title}] Email Confirmation`,
            otp
        // eslint-disable-next-line no-return-await
        }) => await transporter.sendMail({
            from,
            to,
            subject,
            html: nunjucks.render(
                `${pathToUse}/assets/email/verify_email.njk`,
                {
                    appData,
                    link: `${protocol}://${domain}/user/account/verify/email?username=${username}&otp=${otp}`,
                    username,
                    password,
                    homepage,
                    showVerifyEmailButton,
                    userObject
                }
            ),
            attachments: [
                {
                    filename: `app-logo.png`,
                    path: `${pathToUse}/assets/static${appData.logo}`,
                    cid: `app-logo`
                }
            ]
        }),
        sendPasswordChange: async ({
            userObject,
            from = appData.email,
            to,
            subject = appData.hideTitle ? `Password Change` : `[${appData.title}] Password Change`
        // eslint-disable-next-line no-return-await
        }) => await transporter.sendMail({
            from,
            to,
            subject,
            html: nunjucks.render(
                `${pathToUse}/assets/email/password_change.njk`,
                {
                    appData,
                    userObject,
                    from
                }
            ),
            attachments: [
                {
                    filename: `app-logo.png`,
                    path: `${pathToUse}/assets/static${appData.logo}`,
                    cid: `app-logo`
                }
            ]
        }),
        sendEmailChange: async ({
            userObject,
            from = appData.email,
            to,
            subject = appData.hideTitle ? `Email Change` : `[${appData.title}] Email Change`
        // eslint-disable-next-line no-return-await
        }) => await transporter.sendMail({
            from,
            to,
            subject,
            html: nunjucks.render(
                `${pathToUse}/assets/email/email_change.njk`,
                {
                    appData,
                    userObject,
                    from
                }
            ),
            attachments: [
                {
                    filename: `app-logo.png`,
                    path: `${pathToUse}/assets/static${appData.logo}`,
                    cid: `app-logo`
                }
            ]
        }),
        sendPasswordResetOTP: async ({
            userObject,
            username,
            otp,
            from = appData.email,
            to,
            subject = appData.hideTitle ? `Request Password Reset` : `[${appData.title}] Request Password Reset`
        // eslint-disable-next-line no-return-await
        }) => await transporter.sendMail({
            from,
            to,
            subject,
            html: nunjucks.render(
                `${pathToUse}/assets/email/reset_password.njk`,
                {
                    appData,
                    userObject,
                    link: `${protocol}://${domain}/user/password/reset?username=${username}&email=${encodeURIComponent(to)}&otp=${otp}`,
                    from
                }
            ),
            attachments: [
                {
                    filename: `app-logo.png`,
                    path: `${pathToUse}/assets/static${appData.logo}`,
                    cid: `app-logo`
                }
            ]
        }),
        sendEmailTemplate: async ({
            userObject,
            from = appData.email,
            to,
            subject = appData.hideTitle ? `Email Notification` : `[${appData.title}] Email Notification`,
            filename,
            emailData,
            attachments = []
        // eslint-disable-next-line no-return-await
        }) => await transporter.sendMail({
            from,
            to,
            subject,
            html: nunjucks.render(
                `${pathToUse}/assets/email/${filename}.njk`,
                {
                    appData,
                    ...emailData,
                    userObject
                }
            ),
            attachments: [
                {
                    filename: `app-logo.png`,
                    path: `${pathToUse}/assets/static${appData.logo}`,
                    cid: `app-logo`
                },
                ...attachments
            ]
        })
    }
}