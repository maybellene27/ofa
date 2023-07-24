/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable no-await-in-loop */
/* eslint-disable array-callback-return */
// const { models } = require('../src/models')
const { connection } = require('mongoose')
const { appData } = require('../src/config')
const { transporter } = require('../src/config/auth')
const fs = require('fs').promises

module.exports = {
    approvalAging: async () => {
        const { BankApplication, User, FinancingPartner, Branch, Vehicle, Company } = connection.models
        const getBankApplication = await BankApplication.find({
            bankStatus: 'Pending Approval',
            approvalAge: {
                $lte: 30
            }
        })
        if (getBankApplication && getBankApplication.length) {
            await BankApplication.updateMany({
                bankStatus: 'Pending Approval'
            }, {
                $inc: {
                    approvalAge: 1
                }
            })
        }
        const approvalReminder = await BankApplication.find({
            bankStatus: 'Pending Approval',
            approvalAge: 23
        })
        if (approvalReminder && approvalReminder.length) {
            for (const bankApplication of approvalReminder) {
                const applicationUser = await User.findById(bankApplication.user)
                const financingPartner = await FinancingPartner.findById(bankApplication.bank)
                const vehicle = await Vehicle.findById(bankApplication.vehiclePurchased.variant)
                const branch = await Branch.findById(bankApplication.vehiclePurchased.branch)
                const company = await Company.findById(branch.company)
                let logoCompany = ''
                if (company.logo && company.logo.length) {
                    const logo = company.logo && company.logo.length && company.logo[0]
                    const { path, mimetype } = logo
                    const data = await fs.readFile(path)
                    logoCompany = `data:${mimetype};base64,${Buffer.from(data).toString('base64')}`
                }
                await transporter.sendEmailTemplate({
                    userObject: applicationUser,
                    from: appData.email,
                    to: applicationUser.email,
                    subject: 'AC Motors Online Financing - Application Reminder',
                    filename: 'application_reminder',
                    emailData: {
                        bankName: financingPartner.name,
                        vehicle,
                        logo: logoCompany,
                        obj: bankApplication,
                        date: new Date().toISOString()
                            .substr(0, 10)
                    }
                })
            }
        }
        const expiredAge = await BankApplication.find({
            bankStatus: 'Pending Approval',
            approvalAge: 30
        })
        if (expiredAge && expiredAge.length) {
            expiredAge.forEach(async (x) => {
                await BankApplication.findByIdAndUpdate(x._id, {
                    bankStatus: 'Expired'
                })
            })
        }
    },
    recommendAging: async () => {
        const { Application } = connection.models
        const getApplication = await Application.find({
            status: 'submitted',
            recommendAge: {
                $lte: 30
            }
        })
        if (getApplication && getApplication.length) {
            await Application.updateMany({
                status: 'submitted'
            }, {
                $inc: {
                    recommendAge: 1
                }
            })
        }
        const expiredAge = await Application.find({
            status: 'submitted',
            recommendAge: 30
        })
        if (expiredAge && expiredAge.length) {
            expiredAge.forEach(async (x) => {
                await Application.findByIdAndUpdate(x._id, {
                    status: 'recommendExpired'
                })
            })
        }
    },
    releaseAging: async () => {
        const { BankApplication } = connection.models
        const getBankApplication = await BankApplication.find({
            status: 'unreleased',
            bankStatus: 'Approved and Unreleased',
            releaseAge: {
                $lte: 30
            }
        })
        if (getBankApplication && getBankApplication.length) {
            await BankApplication.updateMany({
                status: 'unreleased',
                bankStatus: 'Approved and Unreleased'
            }, {
                $inc: {
                    releaseAge: 1
                }
            })
        }
        const expiredAge = await BankApplication.find({
            status: 'unreleased',
            bankStatus: 'Approved and Unreleased',
            releaseAge: 30
        })
        if (expiredAge && expiredAge.length) {
            expiredAge.forEach(async (x) => {
                await BankApplication.findByIdAndUpdate(x._id, {
                    bankStatus: 'Release Expired'
                })
            })
        }
    },
    approval: async (req, res) => {
        try {
            const { BankApplication } = connection.models
            const getBankApplication = await BankApplication.find({
                status: 'unreleased',
                bankStatus: 'Approved and Unreleased',
                releaseAge: {
                    $lte: 30
                }
            })
            if (getBankApplication && getBankApplication.length) {
                await BankApplication.updateMany({
                    status: 'unreleased',
                    bankStatus: 'Approved and Unreleased'
                }, {
                    $inc: {
                        releaseAge: 1
                    }
                })
            }
            const expiredAge = await BankApplication.find({
                status: 'unreleased',
                bankStatus: 'Approved and Unreleased',
                releaseAge: 30
            })
            if (expiredAge && expiredAge.length) {
                expiredAge.forEach(async (x) => {
                    await BankApplication.findByIdAndUpdate(x._id, {
                        bankStatus: 'Release Expired'
                    })
                })
            }
            res.status(200).json({
                message: 'Success.'
            })
        }
        catch (err) {
            res.status(400).json({
                message: err
            })
        }
    }
}