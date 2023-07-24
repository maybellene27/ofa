/* eslint-disable max-depth */
/* eslint-disable no-await-in-loop */
/* eslint-disable complexity */
/* eslint-disable security/detect-non-literal-fs-filename */
const { connection } = require('mongoose')
const { appData, protocol, domain } = require('../config')
const { transporter } = require('../config/auth')
const models = require('../models')
const { ObjectId } = require('mongoose').Types
const _ = require('lodash')
const fs = require('fs').promises

module.exports = {
    set: (status) => async (req, res) => {
        const { Application, User, BankApplication, Branch, Company, Vehicle } = connection.models
        const { _id } = req.params
        const {
            bankApplication,
            cancelRemarks,
            monthInvoice,
            monthSubmitted
        } = req.body
        let { user } = req.session
        user = user ? user : req.user
        try {
            let application = await Application.findById(_id)
            const applicationUser = await User.findById(application.user)
            if (status === 'unreleased') {
                const dateToday = new Date().toISOString()
                    .substr(0, 10)
                await Application.findByIdAndUpdate(_id, {
                    status: 'unreleased',
                    unreleasedDate: dateToday
                })
                await BankApplication.findByIdAndUpdate(bankApplication, {
                    status: 'unreleased',
                    unreleasedDate: dateToday
                })
                const recommendedBankApplicationList = await BankApplication.find({
                    application: _id,
                    status: 'recommended',
                    bankStatus: {
                        $ne: 'Declined'
                    }
                })
                if (recommendedBankApplicationList && recommendedBankApplicationList.length) {
                    await BankApplication.updateMany({
                        application: _id,
                        status: 'recommended',
                        bankStatus: {
                            $ne: 'Declined'
                        }
                    }, {
                        status: 'unreleased',
                        bankStatus: 'Not Applicable',
                        unreleasedDate: dateToday
                    })
                }
                const recommendedApplicationLeft = await BankApplication.find({
                    application: _id,
                    status: 'recommended'
                })
                if (recommendedApplicationLeft && recommendedApplicationLeft.length) {
                    await BankApplication.updateMany({
                        application: _id,
                        status: 'recommended'
                    }, {
                        status: 'unreleased',
                        unreleasedDate: dateToday
                    })
                }
                const selectedApplication = await BankApplication.findById(bankApplication)
                const salesExecutive = await User.findById(selectedApplication.vehiclePurchased.salesExecutive)
                const vehicle = await Vehicle.findById(selectedApplication.vehiclePurchased.variant)
                const branch = await Branch.findById(selectedApplication.vehiclePurchased.branch)
                const company = await Company.findById(branch.company)
                let logoCompany = ''
                if (company.logo && company.logo.length) {
                    const logo = company.logo && company.logo.length && company.logo[0]
                    const { path, mimetype } = logo
                    const data = await fs.readFile(path)
                    logoCompany = `data:${mimetype};base64,${Buffer.from(data).toString('base64')}`
                }
                const bankApprovers = await User.find({
                    bank: selectedApplication.bank,
                    userRole: 'bankApprover',
                    multipleBranch: {
                        $in: selectedApplication.vehiclePurchased.branch
                    },
                    brand: {
                        $in: selectedApplication.vehiclePurchased.brand
                    },
                    _status: {
                        $ne: 'deleted'
                    }
                })
                const superUsers = await User.find({
                    superUserBank: {
                        $elemMatch: {
                            $in: selectedApplication.vehiclePurchased.banks
                        }
                    },
                    multipleBranch: {
                        $elemMatch: {
                            $in: [ selectedApplication.vehiclePurchased.branch ]
                        }
                    }, 
                    userRole: 'superUser',
                    _status: {
                        $ne: 'deleted'
                    }
                })
                for (const superU of superUsers) {
                    await transporter.sendEmailTemplate({
                        userObject: superU,
                        from: appData.email,
                        to: superU.email,
                        subject: 'AC Motors Online Financing - Selected Bank',
                        filename: 'application_selected',
                        emailData: {
                            salesExecutive,
                            obj: selectedApplication,
                            vehicle,
                            logo: logoCompany,
                            customer: applicationUser,
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
                }
                for (const bankA of bankApprovers) {
                    await transporter.sendEmailTemplate({
                        userObject: bankA,
                        from: appData.email,
                        to: bankA.email,
                        subject: 'AC Motors Online Financing - Selected Bank',
                        filename: 'application_selected',
                        emailData: {
                            salesExecutive,
                            obj: selectedApplication,
                            vehicle,
                            logo: logoCompany,
                            customer: applicationUser,
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
                }
                const unselectedBankApplication = await BankApplication.find({
                    application: _id,
                    bankStatus: 'Not Applicable'
                })
                if (unselectedBankApplication && unselectedBankApplication.length) {
                    for (const v of unselectedBankApplication) {
                        const salesExecutiveUnselected = await User.findById(v.vehiclePurchased.salesExecutive)
                        const bankApproversUnselected = await User.find({
                            bank: v.bank,
                            userRole: 'bankApprover',
                            _status: {
                                $ne: 'deleted'
                            }
                        })
                        const vehicleUnselected = await Vehicle.findById(v.vehiclePurchased.variant)
                        const branchUnselected = await Branch.findById(v.vehiclePurchased.branch)
                        const companyUnselected = await Company.findById(branchUnselected.company)
                        let logoCompanyUnselected = ''
                        if (companyUnselected.logo && companyUnselected.logo.length) {
                            const logo = companyUnselected.logo && companyUnselected.logo.length && companyUnselected.logo[0]
                            const { path, mimetype } = logo
                            const data = await fs.readFile(path)
                            logoCompanyUnselected = `data:${mimetype};base64,${Buffer.from(data).toString('base64')}`
                        }
                        for (const ubank of bankApproversUnselected) {
                            await transporter.sendEmailTemplate({
                                userObject: ubank,
                                from: appData.email,
                                to: ubank.email,
                                subject: 'AC Motors Online Financing - Unselected Bank',
                                filename: 'application_unselected',
                                emailData: {
                                    salesExecutive: salesExecutiveUnselected,
                                    obj: selectedApplication,
                                    vehicle: vehicleUnselected,
                                    logo: logoCompanyUnselected,
                                    customer: applicationUser,
                                    company: companyUnselected
                                },
                                attachments: [
                                    {
                                        filename: 'app-logo1.png',
                                        path: logoCompanyUnselected,
                                        cid: 'app-logo1'
                                    }
                                ]
                            })
                        }
                    }
                }
            }
            else if (status === 'cancelled') {
                await Application.findByIdAndUpdate(_id, {
                    status: 'cancelled',
                    cancelRemarks
                })
                const bankApplicationList = await BankApplication.find({
                    application: _id,
                    bankStatus: 'Not Applicable'
                })
                if (bankApplicationList && bankApplicationList.length) {
                    await BankApplication.updateMany({
                        application: _id,
                        bankStatus: 'Not Applicable'
                    }, {
                        status: 'cancelled',
                        cancelRemarks
                    })
                }
                await BankApplication.findByIdAndUpdate(bankApplication, {
                    status: 'cancelled',
                    cancelRemarks,
                    bankStatus: 'Cancelled'
                })
                await transporter.sendEmailTemplate({
                    userObject: applicationUser,
                    from: appData.email,
                    to: applicationUser.email,
                    subject: `AC Motors Online Financing - Application Cancelled`,
                    filename: 'application_cancelled',
                    emailData: {
                        cancelRemarks
                    }
                })
            }
            else if (status === 'approved') {
                const dateToday = new Date().toISOString()
                    .substr(0, 10)
                await Application.findByIdAndUpdate(_id, {
                    status: 'approved',
                    dateReleased: dateToday,
                    selectedBank: bankApplication,
                    monthInvoice,
                    monthSubmitted
                })
                const bankApplicationList = await BankApplication.find({
                    application: _id,
                    bankStatus: 'Not Applicable'
                })
                if (bankApplicationList && bankApplicationList.length) {
                    await BankApplication.updateMany({
                        application: _id,
                        bankStatus: 'Not Applicable'
                    }, {
                        status: 'approved',
                        selectedBank: bankApplication,
                        dateReleased: dateToday,
                        monthInvoice,
                        monthSubmitted
                    })
                }
                await BankApplication.findByIdAndUpdate(bankApplication, {
                    status: 'approved',
                    bankStatus: 'Approved and Released',
                    selectedBank: bankApplication,
                    dateReleased: dateToday,
                    monthInvoice,
                    monthSubmitted
                })
                const mainBankApplication = await BankApplication.findById(bankApplication)
                const salesExecutive = await User.findById(mainBankApplication.vehiclePurchased.salesExecutive)
                const vehicle = await Vehicle.findById(mainBankApplication.vehiclePurchased.variant)
                const branch = await Branch.findById(mainBankApplication.vehiclePurchased.branch)
                const company = await Company.findById(branch.company)
                let logoCompany = ''
                if (company.logo && company.logo.length) {
                    const logo = company.logo && company.logo.length && company.logo[0]
                    const { path, mimetype } = logo
                    const data = await fs.readFile(path)
                    logoCompany = `data:${mimetype};base64,${Buffer.from(data).toString('base64')}`
                }
                const bankApprovers = await User.find({
                    bank: mainBankApplication.bank,
                    userRole: 'bankApprover',
                    multipleBranch: {
                        $in: mainBankApplication.vehiclePurchased.branch
                    },
                    brand: {
                        $in: mainBankApplication.vehiclePurchased.brand
                    },
                    _status: {
                        $ne: 'deleted'
                    }
                })
                const superUsers = await User.find({
                    superUserBank: {
                        $elemMatch: {
                            $in: mainBankApplication.vehiclePurchased.banks
                        }
                    },
                    multipleBranch: {
                        $elemMatch: {
                            $in: [ mainBankApplication.vehiclePurchased.branch ]
                        }
                    }, 
                    userRole: 'superUser',
                    _status: {
                        $ne: 'deleted'
                    }
                })
                for (const superU of superUsers) {
                    await transporter.sendEmailTemplate({
                        userObject: superU,
                        from: appData.email,
                        to: superU.email,
                        subject: 'AC Motors Online Financing - Selected Bank',
                        filename: 'application_selected',
                        emailData: {
                            salesExecutive,
                            obj: mainBankApplication,
                            vehicle,
                            logo: logoCompany,
                            customer: applicationUser,
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
                }
                for (const bankA of bankApprovers) {
                    await transporter.sendEmailTemplate({
                        userObject: bankA,
                        from: appData.email,
                        to: bankA.email,
                        subject: 'AC Motors Online Financing - Unit Released',
                        filename: 'application_approved',
                        emailData: {
                            salesExecutive,
                            obj: mainBankApplication,
                            vehicle,
                            logo: logoCompany,
                            customer: applicationUser,
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
                }
            }
            else if (status === 'recommended') {
                const dateToday = new Date().toISOString()
                    .substr(0, 10)
                application = _.merge(application, {
                    status,
                    recommendDate: dateToday,
                    _revision: {
                        author: {
                            userModel: models.user.constructor.modelName,
                            // eslint-disable-next-line new-cap
                            doc: ObjectId(user)
                        },
                        description: `Set application ${_id} status to ${status}.`
                    }
                })
                await application.save()
            }
            else {
                application = _.merge(application, {
                    status,
                    _revision: {
                        author: {
                            userModel: models.user.constructor.modelName,
                            // eslint-disable-next-line new-cap
                            doc: ObjectId(user)
                        },
                        description: `Set application ${_id} status to ${status}.`
                    }
                })
                await application.save()
            }
            if (status === 'returned') {
                await transporter.sendEmailTemplate({
                    userObject: applicationUser,
                    from: appData.email,
                    to: applicationUser.email,
                    subject: `AC Motors Online Financing - Application ${_.startCase(status)}`,
                    filename: `application_${status}`
                })
            }
            res.status(200).json({
                message: `Application successfully ${status}.`,
                entry: application
            })
        }
        catch (err) {
            res.status(400).json({
                message: err
            })
        }
    },
    transfer: async (req, res) => {
        const { Application, BankApplication, Branch, User, Company } = connection.models
        const { _id } = req.params
        const { branch, previousBranch } = req.body
        let { user } = req.session
        user = user ? user : req.user
        try {
            let application = await Application.findById(_id)
            const previousBranchDetails = await Branch.findById(previousBranch)
            const currentBranchDetails = await Branch.findById(branch)
            const company = await Company.findById(currentBranchDetails.company)
            let logoCompany = ''
            if (company.logo && company.logo.length) {
                const logo = company.logo && company.logo.length && company.logo[0]
                const { path, mimetype } = logo
                const data = await fs.readFile(path)
                logoCompany = `data:${mimetype};base64,${Buffer.from(data).toString('base64')}`
            }
            const applicationUser = await User.findById(application.user)
            application = _.merge(application, {
                status: 'draft',
                vehiclePurchased: {
                    branch,
                    salesExecutive: null,
                    banks: null
                },
                bankTransferRemarks: `This application form came from ${previousBranchDetails.name} before`,
                _revision: {
                    author: {
                        userModel: models.user.constructor.modelName,
                        // eslint-disable-next-line new-cap
                        doc: ObjectId(user)
                    },
                    description: `Set application ${_id} status to returned.`
                }
            })

            await application.save()
            const bankApplicationList = await BankApplication.find({
                application: _id
            })
            if (bankApplicationList && bankApplicationList.length) {
                await BankApplication.deleteMany({
                    application: _id
                })
            }
            await transporter.sendEmailTemplate({
                userObject: applicationUser,
                from: appData.email,
                to: applicationUser.email,
                subject: 'AC Motors Online Financing - Transfer of Approval',
                filename: 'application_transfer',
                emailData: {
                    previousBranch: previousBranchDetails.name,
                    currentBranch: currentBranchDetails.name,
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
            res.status(200).json({
                message: 'Application successfully returned.'
            })
        }
        catch (err) {
            res.status(400).json({
                message: err
            })
        }
    },
    return: async (req, res) => {
        const { Application, User, Branch, Company } = connection.models
        const { _id } = req.params
        const { returnReason, ...rest } = req.body
        let { user } = req.session
        user = user ? user : req.user
        try {
            let application = await Application.findById(_id)

            application = _.merge(application, {
                status: 'returned',
                _revision: {
                    author: {
                        userModel: models.user.constructor.modelName,
                        // eslint-disable-next-line new-cap
                        doc: ObjectId(user)
                    },
                    description: `Set application ${_id} status to returned.`
                },
                vehiclePurchased: rest,
                returnReason
            })

            await application.save()

            const applicationUser = await User.findById(application.user)
            const branch = await Branch.findById(application.vehiclePurchased.branch)
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
                subject: 'AC Motors Online Financing - Application Returned',
                filename: 'application_return',
                emailData: {
                    returnReason,
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

            res.status(200).json({
                message: 'Application successfully returned.'
            })
        }
        catch (err) {
            res.status(400).json({
                message: err
            })
        }
    },
    sendMail: async (req, res) => {
        const { Application, User, BankApplication, FinancingPartner, Branch, Vehicle, Company } = connection.models
        const { _id } = req.params
        const { bankApplication } = req.body
        try {
            const application = await Application.findById(_id)

            const applicationUser = await User.findById(application.user)
            const bankApplicationDetails = await BankApplication.findById(bankApplication)
            const financingPartner = await FinancingPartner.findById(bankApplicationDetails.bank)
            const vehicle = await Vehicle.findById(bankApplicationDetails.vehiclePurchased.variant)
            const branch = await Branch.findById(bankApplicationDetails.vehiclePurchased.branch)
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
                    obj: bankApplicationDetails,
                    date: new Date().toISOString()
                        .substr(0, 10)

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
                message: 'Application successfully returned.'
            })
        }
        catch (err) {
            res.status(400).json({
                message: err
            })
        }
    },
    submitSendMail: async function (req, res) {
        try {
            const { User, Branch, Vehicle, Company, Application } = connection.models
            const { _id } = req.params
            const application = await Application.findById(_id)
            const applicationUser = await User.findById(application.user)
            const salesExecutive = await User.findById(application.vehiclePurchased.salesExecutive)
            const vehicle = await Vehicle.findById(application.vehiclePurchased.variant)
            const branch = await Branch.findById(application.vehiclePurchased.branch)
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
                subject: `AC Motors Online Financing - Your Application has been received`,
                filename: 'application_submitted',
                emailData: {
                    salesExecutive,
                    link: `${protocol}://${domain}/login`,
                    obj: application,
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
                        $in: [ application.vehiclePurchased.branch ]
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
                        $in: [ application.vehiclePurchased.branch ]
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
                singleBranch: application.vehiclePurchased.branch,
                userRole: 'systemAdmin',
                _status: {
                    $ne: 'deleted'
                }
            })
            const superUsers = await User.find({
                superUserBank: {
                    $elemMatch: {
                        $in: application.vehiclePurchased.banks
                    }
                },
                multipleBranch: {
                    $elemMatch: {
                        $in: [ application.vehiclePurchased.branch ]
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
                subject: `AC Motors Online Financing - A new application has arrived`,
                filename: 'applicationInternal_submitted',
                emailData: {
                    salesExecutive,
                    link: `${protocol}://${domain}/login`,
                    obj: application,
                    vehicle,
                    branch,
                    logo: logoCompany,
                    customer: applicationUser,
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
                message: 'Application successfully submitted'
            })
        }
        catch (err) {
            res.status(400).json({
                message: err
            })
        }
    },
    recommendSendMail: async function (req, res) {
        const { Application, User, Branch, Company, Vehicle } = connection.models
        const { _id } = req.params
        try {
            const application = await Application.findById(_id)
            const applicationUser = await User.findById(application.user)
            const { FinancingPartner } = connection.models
            const banks = await Promise.all(application.vehiclePurchased.banks.map(async (bankId) => {
                const bankName = await FinancingPartner.findById(bankId)
                return bankName.name
            }))
            const banksString = banks.toString().split(',')
                .join(', ')
            const branch = await Branch.findById(application.vehiclePurchased.branch)
            const company = await Company.findById(branch.company)
            let logoCompany = ''
            if (company.logo && company.logo.length) {
                const logo = company.logo && company.logo.length && company.logo[0]
                const { path, mimetype } = logo
                const data = await fs.readFile(path)
                logoCompany = `data:${mimetype};base64,${Buffer.from(data).toString('base64')}`
            }  
            const salesExecutive = await User.findById(application.vehiclePurchased.salesExecutive)
            const vehicle = await Vehicle.findById(application.vehiclePurchased.variant)
            await transporter.sendEmailTemplate({
                userObject: applicationUser,
                from: appData.email,
                to: applicationUser.email,
                subject: `AC Motors Online Financing - Your Application has been submitted`,
                filename: 'application_recommended',
                emailData: {
                    link: `${protocol}://${domain}/login`,
                    brand: application.vehiclePurchased.brand,
                    banks: banksString,
                    salesExecutive,
                    obj: application,
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
                        $in: [ application.vehiclePurchased.branch ]
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
                        $in: [ application.vehiclePurchased.branch ]
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
                singleBranch: application.vehiclePurchased.branch,
                userRole: 'systemAdmin',
                _status: {
                    $ne: 'deleted'
                }
            })
            const bankApprovers = await User.find({
                bank: {
                    $in: application.vehiclePurchased.banks
                },
                multipleBranch: {
                    $elemMatch: {
                        $in: [ application.vehiclePurchased.branch ]
                    }
                },
                brand: {
                    $elemMatch: {
                        $in: [ application.vehiclePurchased.brand ]
                    }
                },
                userRole: 'bankApprover',
                _status: {
                    $ne: 'deleted'
                }
            })
            const superUsers = await User.find({
                superUserBank: {
                    $elemMatch: {
                        $in: application.vehiclePurchased.banks
                    }
                },
                multipleBranch: {
                    $elemMatch: {
                        $in: [ application.vehiclePurchased.branch ]
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
                userObject: applicationUser,
                from: appData.email,
                to: internalEmails,
                subject: `AC Motors Online Financing - Application Status`,
                filename: 'applicationInternal_recommended',
                emailData: {
                    link: `${protocol}://${domain}/login`,
                    brand: application.vehiclePurchased.brand,
                    banks: banksString,
                    salesExecutive,
                    obj: application,
                    vehicle,
                    logo: logoCompany,
                    company,
                    customer: applicationUser
                },
                attachments: [
                    {
                        filename: 'app-logo1.png',
                        path: logoCompany,
                        cid: 'app-logo1'
                    }
                ]
            })
            for (const bankA of bankApprovers) {
                await transporter.sendEmailTemplate({
                    userObject: bankA,
                    from: appData.email,
                    to: bankA.email,
                    subject: `AC Motors Online Financing - Recommended Application`,
                    filename: 'applicationExternal_recommended',
                    emailData: {
                        link: `${protocol}://${domain}/login`,
                        brand: application.vehiclePurchased.brand,
                        banks: banksString,
                        salesExecutive,
                        obj: application,
                        vehicle,
                        logo: logoCompany,
                        customer: applicationUser,
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
            }
            res.status(200).json({
                message: 'Application successfully recommended'
            })
        }
        catch (err) {
            res.status(400).json({
                message: err
            })
        }
    }
}