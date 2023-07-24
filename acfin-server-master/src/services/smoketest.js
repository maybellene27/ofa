const ip = require('ip')

const { appData } = require('../config')
const { transporter } = require('../config/auth')
const userModel = require('../models/user')

module.exports = {
    test: (req, res) => {
        res.status(200).json({
            message: 'Hello, world!'
        })
    },
    emailtest: async (req, res) => {
        try {
            await transporter.sendEmailTemplate({
                userObject: null,
                from: appData.email,
                to: 'jason.obrero@maroonstudios.com',
                subject: `[${appData.title}] Email Test`,
                filename: `email_test`,
                emailData: {
                    ip: ip.address()
                }
            })
            res.status(200).json({
                message: 'Test email should have been sent.'
            })
        }
        catch (err) {
            res.status(400).json({
                message: err.message
            })
        }
    },
    usercount: async (req, res) => {
        try {
            const userCount = await userModel.find().countDocuments()
            res.status(200).json({
                message: 'This count may include users for internal purposes.',
                userCount
            })
        }
        catch (err) {
            res.status(400).json({
                message: err.message
            })
        }
    }
}