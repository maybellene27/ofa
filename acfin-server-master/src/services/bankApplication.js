/* eslint-disable no-await-in-loop */
/* eslint-disable security/detect-non-literal-fs-filename */
const { connection } = require('mongoose')
const models = require('../models')
const { appData, protocol, domain } = require('../config')
const { transporter } = require('../config/auth')

const { ObjectId } = require('mongoose').Types
const _ = require('lodash')
const fs = require('fs').promises

const statusDict = {
    pending: 'Pending Approval',
    unreleased: 'Approved and Unreleased',
    released: 'Approved and Released',
    rejected: 'Declined',
    notApplicable: 'Not Applicable',
    returned: 'Returned'
}

module.exports = {
    set: (key) => async (req, res) => {
        const { BankApplication, User, FinancingPartner, Branch, Company, Vehicle, Application } = connection.models
        const { _id } = req.params
        const { declineReason } = req.body

        let { user } = req.session
        user = user ? user : req.user

        const status = statusDict[`${key}`]

        try {
            let bankApplication = await BankApplication.findById(_id)
            const financingPartner = await FinancingPartner.findById(bankApplication.bank)
            const applicationUser = await User.findById(bankApplication.user)
            if (key === 'rejected') {
                const dateToday = new Date().toISOString()
                    .substr(0, 10)
                bankApplication = _.merge(bankApplication, {
                    bankStatus: status,
                    declineReason,
                    bankDeclinedDate: dateToday,
                    _revision: {
                        author: {
                            userModel: models.user.constructor.modelName,
                            // eslint-disable-next-line new-cap
                            doc: ObjectId(user)
                        },
                        description: `Set bank application ${_id} status to ${status}.`
                    }
                })
                await bankApplication.save()
                const salesExecutive = await User.findById(bankApplication.vehiclePurchased.salesExecutive)
                const branch = await Branch.findById(bankApplication.vehiclePurchased.branch)
                const company = await Company.findById(branch.company)
                let logoCompany = ''
                if (company.logo && company.logo.length) {
                    const logo = company.logo && company.logo.length && company.logo[0]
                    const { path, mimetype } = logo
                    const data = await fs.readFile(path)
                    logoCompany = `data:${mimetype};base64,${Buffer.from(data).toString('base64')}`
                }
                const vehicle = await Vehicle.findById(bankApplication.vehiclePurchased.variant)
                await transporter.sendEmailTemplate({
                    userObject: applicationUser,
                    from: appData.email,
                    to: applicationUser.email,
                    subject: `AC Motors Online Financing - Your Application is Declined`,
                    filename: 'bankApplication_decline',
                    emailData: {
                        declineReason,
                        bankName: financingPartner.name,
                        link: `${protocol}://${domain}/login`,
                        brand: bankApplication.vehiclePurchased.brand,
                        salesExecutive,
                        obj: bankApplication,
                        vehicle,
                        logo: logoCompany
                    },
                    attachments: [
                        {
                            filename: 'app-logo1.png',
                            path: logoCompany,
                            cid: 'app-logo1'
                        }
                    ]
                })
                const salesManager = await User.find({
                    multipleBranch: {
                        $elemMatch: {
                            $in: [ bankApplication.vehiclePurchased.branch ]
                        }
                    }, 
                    userRole: 'salesManager',
                    _status: {
                        $ne: 'deleted'
                    }
                })
                const finance = await User.find({
                    multipleBranch: {
                        $elemMatch: {
                            $in: [ bankApplication.vehiclePurchased.branch ]
                        }
                    }, 
                    userRole: 'finance',
                    _status: {
                        $ne: 'deleted'
                    }
                })
                const platformAdmins = await User.find({
                    userRole: 'admin',
                    _status: {
                        $ne: 'deleted'
                    } 
                })
                const systemAdmins = await User.find({
                    singleBranch: bankApplication.vehiclePurchased.branch,
                    userRole: 'systemAdmin',
                    _status: {
                        $ne: 'deleted'
                    }
                })
                const superUsers = await User.find({
                    superUserBank: {
                        $elemMatch: {
                            $in: bankApplication.vehiclePurchased.banks
                        }
                    },
                    multipleBranch: {
                        $elemMatch: {
                            $in: [ bankApplication.vehiclePurchased.branch ]
                        }
                    }, 
                    userRole: 'superUser',
                    _status: {
                        $ne: 'deleted'
                    }
                })
                const salesManagerEmail = salesManager.map((i) => i.email)
                const platformAdminEmail = platformAdmins.map((i) => i.email)
                const systemAdminEmail = systemAdmins.map((i) => i.email)
                const financeEmail = finance.map((i) => i.email)
                const superUserEmail = superUsers.map((i) => i.email)
                const internalEmails = [
                    ...salesManagerEmail,
                    salesExecutive.email,
                    ...platformAdminEmail,
                    ...systemAdminEmail,
                    ...financeEmail,
                    ...superUserEmail
                ]
                await transporter.sendEmailTemplate({
                    userObject: salesExecutive,
                    from: appData.email,
                    to: internalEmails,
                    subject: 'AC Motors Online Financing - Application Status',
                    filename: 'bankApplicationInternal_decline',
                    emailData: {
                        declineReason,
                        bankName: financingPartner.name,
                        customer: applicationUser,
                        salesExecutive,
                        link: `${protocol}://${domain}/login`,
                        brand: bankApplication.vehiclePurchased.brand,
                        obj: bankApplication,
                        vehicle,
                        logo: logoCompany,
                        company,
                        branch
                    },
                    attachments: [
                        {
                            filename: 'app-logo1.png',
                            path: logoCompany,
                            cid: 'app-logo1'
                        }
                    ]
                })
                const bankApplicationsList = await BankApplication.find({
                    application: bankApplication.application
                })
                const bankApplicationsDeclined = await BankApplication.find({
                    application: bankApplication.application,
                    bankStatus: 'Declined' 
                })
                if (bankApplicationsList.length !== 0 && bankApplicationsDeclined.length !== 0 && bankApplicationsList.length === bankApplicationsDeclined.length) {
                    await Application.findByIdAndUpdate(bankApplication.application, {
                        status: 'rejected'
                    })
                    for (const bankApp of bankApplicationsDeclined) {
                        await BankApplication.findByIdAndUpdate(bankApp._id, {
                            status: 'rejected'
                        })
                    }
                    await BankApplication.findByIdAndUpdate(_id, {
                        status: 'rejected'
                    })
                }
            }
            else if (key === 'unreleased') {
                const dateToday = new Date().toISOString()
                    .substr(0, 10)
                bankApplication = _.merge(bankApplication, {
                    bankStatus: status,
                    bankApproveDate: dateToday,
                    _revision: {
                        author: {
                            userModel: models.user.constructor.modelName,
                            // eslint-disable-next-line new-cap
                            doc: ObjectId(user)
                        },
                        description: `Set bank application ${_id} status to ${status}.`
                    }
                })
                await bankApplication.save()
                const salesExecutive = await User.findById(bankApplication.vehiclePurchased.salesExecutive)
                const branch = await Branch.findById(bankApplication.vehiclePurchased.branch)
                const company = await Company.findById(branch.company)
                let logoCompany = ''
                if (company.logo && company.logo.length) {
                    const logo = company.logo && company.logo.length && company.logo[0]
                    const { path, mimetype } = logo
                    const data = await fs.readFile(path)
                    logoCompany = `data:${mimetype};base64,${Buffer.from(data).toString('base64')}`
                }
                const vehicle = await Vehicle.findById(bankApplication.vehiclePurchased.variant)
                await transporter.sendEmailTemplate({
                    userObject: applicationUser,
                    from: appData.email,
                    to: applicationUser.email,
                    subject: 'AC Motors Online Financing - Congratulations! Your Application is Approved',
                    filename: 'bankApplication_approved',
                    emailData: {
                        bankName: financingPartner.name,
                        brand: bankApplication.vehiclePurchased.brand,
                        link: `${protocol}://${domain}/login`,
                        salesExecutive,
                        obj: bankApplication,
                        vehicle,
                        logo: logoCompany
                    },
                    attachments: [
                        {
                            filename: 'app-logo1.png',
                            path: logoCompany,
                            cid: 'app-logo1'
                        }
                    ]
                })
                const salesManager = await User.find({
                    multipleBranch: {
                        $elemMatch: {
                            $in: [ bankApplication.vehiclePurchased.branch ]
                        }
                    }, 
                    userRole: 'salesManager',
                    _status: {
                        $ne: 'deleted'
                    }
                })
                const finance = await User.find({
                    multipleBranch: {
                        $elemMatch: {
                            $in: [ bankApplication.vehiclePurchased.branch ]
                        }
                    }, 
                    userRole: 'finance',
                    _status: {
                        $ne: 'deleted'
                    }
                })
                const platformAdmins = await User.find({
                    userRole: 'admin',
                    _status: {
                        $ne: 'deleted'
                    }
                })
                const systemAdmins = await User.find({
                    singleBranch: bankApplication.vehiclePurchased.branch,
                    userRole: 'systemAdmin',
                    _status: {
                        $ne: 'deleted'
                    }
                })
                const superUsers = await User.find({
                    superUserBank: {
                        $elemMatch: {
                            $in: bankApplication.vehiclePurchased.banks
                        }
                    },
                    multipleBranch: {
                        $elemMatch: {
                            $in: [ bankApplication.vehiclePurchased.branch ]
                        }
                    }, 
                    userRole: 'superUser',
                    _status: {
                        $ne: 'deleted'
                    }
                })
                const salesManagerEmail = salesManager.map((i) => i.email)
                const platformAdminEmail = platformAdmins.map((i) => i.email)
                const systemAdminEmail = systemAdmins.map((i) => i.email)
                const financeEmail = finance.map((i) => i.email)
                const superUserEmail = superUsers.map((i) => i.email)
                const internalEmails = [
                    ...salesManagerEmail,
                    salesExecutive.email,
                    ...platformAdminEmail,
                    ...systemAdminEmail,
                    ...financeEmail,
                    ...superUserEmail
                ]
                await transporter.sendEmailTemplate({
                    userObject: salesExecutive,
                    from: appData.email,
                    to: internalEmails,
                    subject: 'AC Motors Online Financing - Application Status',
                    filename: 'bankApplicationInternal_approved',
                    emailData: {
                        bankName: financingPartner.name,
                        customer: applicationUser,
                        salesExecutive,
                        link: `${protocol}://${domain}/login`,
                        brand: bankApplication.vehiclePurchased.brand,
                        obj: bankApplication,
                        vehicle,
                        logo: logoCompany,
                        company,
                        branch
                    },
                    attachments: [
                        {
                            filename: 'app-logo1.png',
                            path: logoCompany,
                            cid: 'app-logo1'
                        }
                    ]
                })
            }
            else {
                bankApplication = _.merge(bankApplication, {
                    bankStatus: status,
                    _revision: {
                        author: {
                            userModel: models.user.constructor.modelName,
                            // eslint-disable-next-line new-cap
                            doc: ObjectId(user)
                        },
                        description: `Set bank application ${_id} status to ${status}.`
                    }
                })
                await bankApplication.save()
            }
            res.status(200).json({
                message: `Bank application successfully updated.`
            })
        }
        catch (err) {
            res.status(400).json({
                message: err
            })
        }
    },
    return: async (req, res) => {
        const { BankApplication, User, FinancingPartner, Branch, Vehicle, Company } = connection.models
        const { _id } = req.params
        const { returnReason, ...rest } = req.body
        let { user } = req.session
        user = user ? user : req.user
        try {
            let bankApplication = await BankApplication.findById(_id)
            const dateToday = new Date().toISOString()
                .substr(0, 10)
            bankApplication = _.merge(bankApplication, {
                bankStatus: 'Returned',
                bankReturnedDate: dateToday,
                _revision: {
                    author: {
                        userModel: models.user.constructor.modelName,
                        // eslint-disable-next-line new-cap
                        doc: ObjectId(user)
                    },
                    description: `Set bank application ${_id} status to returned.`
                },
                vehiclePurchased: rest,
                bankReturnReason: returnReason
            })
            await bankApplication.save()
            const applicationUser = await User.findById(bankApplication.user)
            const financingPartner = await FinancingPartner.findById(bankApplication.bank)
            const salesExecutive = await User.findById(bankApplication.vehiclePurchased.salesExecutive)
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
                subject: `AC Motors Online Financing - Your Application is pending`,
                filename: 'bankApplication_return',
                emailData: {
                    bankReturnReason: returnReason,
                    bankName: financingPartner.name,
                    link: `${protocol}://${domain}/login`,
                    salesExecutive,
                    brand: bankApplication.vehiclePurchased.brand,
                    obj: bankApplication,
                    vehicle,
                    logo: logoCompany
                },
                attachments: [
                    {
                        filename: 'app-logo1.png',
                        path: logoCompany,
                        cid: 'app-logo1'
                    }
                ]
            })
            const salesManager = await User.find({
                multipleBranch: {
                    $elemMatch: {
                        $in: [ bankApplication.vehiclePurchased.branch ]
                    }
                },
                userRole: 'salesManager',
                _status: {
                    $ne: 'deleted'
                }
            })
            const finance = await User.find({
                multipleBranch: {
                    $elemMatch: {
                        $in: [ bankApplication.vehiclePurchased.branch ]
                    }
                },
                userRole: 'finance',
                _status: {
                    $ne: 'deleted'
                }
            })
            const platformAdmins = await User.find({
                userRole: 'admin',
                _status: {
                    $ne: 'deleted'
                }
            })
            const systemAdmins = await User.find({
                singleBranch: bankApplication.vehiclePurchased.branch,
                userRole: 'systemAdmin',
                _status: {
                    $ne: 'deleted'
                }
            })
            const superUsers = await User.find({
                superUserBank: {
                    $elemMatch: {
                        $in: bankApplication.vehiclePurchased.banks
                    }
                },
                multipleBranch: {
                    $elemMatch: {
                        $in: [ bankApplication.vehiclePurchased.branch ]
                    }
                }, 
                userRole: 'superUser',
                _status: {
                    $ne: 'deleted'
                }
            })
            const salesManagerEmail = salesManager.map((i) => i.email)
            const platformAdminEmail = platformAdmins.map((i) => i.email)
            const systemAdminEmail = systemAdmins.map((i) => i.email)
            const financeEmail = finance.map((i) => i.email)
            const superUserEmail = superUsers.map((i) => i.email)
            const internalEmails = [
                ...salesManagerEmail,
                salesExecutive.email,
                ...platformAdminEmail,
                ...systemAdminEmail,
                ...financeEmail,
                ...superUserEmail
            ]
            await transporter.sendEmailTemplate({
                userObject: salesExecutive,
                from: appData.email,
                to: internalEmails,
                subject: 'AC Motors Online Financing - Application Status',
                filename: 'bankApplicationInternal_return',
                emailData: {
                    bankReturnReason: returnReason,
                    bankName: financingPartner.name,
                    customer: applicationUser,
                    obj: bankApplication,
                    vehicle,
                    logo: logoCompany,
                    company
                },
                attachments: [
                    {
                        filename: 'app-logo1.png',
                        path: logoCompany,
                        cid: 'app-logo1'
                    }
                ]
            })
            res.status(200).json({
                message: `Bank application successfully updated.`
            })
        }
        catch (err) {
            res.status(400).json({
                message: err
            })
        }
    },
    deleteBankApplications: async (req, res) => {
        const { BankApplication, Application } = connection.models
        const { _id } = req.params
        try {
            await BankApplication.deleteMany({
                application: _id
            })
            let application = await Application.findById(_id)
            application = _.merge(application, {
                status: 'submitted'
            })
            await application.save()
            res.status(200).json({
                message: 'While recommending application, an error has occured. Please try again.'
            })
        }
        catch (err) {
            res.status(400).json({
                message: err
            })
        }
    }
}