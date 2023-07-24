/* eslint-disable security/detect-non-literal-fs-filename */
// Rule is needed to be disabled for Mongoose
/* eslint-disable no-invalid-this */
// Rule is needed to be disabled for the ObjectId to be parsed correctly
/* eslint-disable new-cap */
const { Schema, connection } = require('mongoose')
const { ObjectId } = require('mongoose').Types
const { schemaFactory, modelFactory } = require('mongodb-plugin')
const autopopulate = require('mongoose-autopopulate')

const address = require('../schema/address')
const personalInformation = require('../schema/personalInformation')
const employment = require('../schema/employment')
const vehiclePurchased = require('../schema/vehiclePurchased')
const attachment = require('../schema/attachment')

const {
    padDates = true,
    padTimes = true
} = require('../config/meta')

const aggregationHelper = require('../lib/aggregationHelpers')({
    padDates,
    padTimes
})
const { statusEquivalent, reverseStatusEquivalent } = require('./lib/applicationSearchValue')

const isDraft = function () {
    return this.status === 'draft'
}
const applicationObj = {
    consentClause: {
        type: Boolean,
        default: false
    },
    recommendAge: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: [
            'draft',
            'submitted',
            'recommended',
            'returned',
            'approved',
            'rejected',
            'recommendExpired',
            'unreleased',
            'cancelled'
        ],
        default: 'draft'
    },
    user: {
        type: 'ObjectId',
        ref: 'User',
        required: [
            true,
            'User is required'
        ]
    },
    age: {
        type: String,
        required: [
            !isDraft,
            'Age is required.'
        ]
    },
    birthday: {
        type: String,
        required: [
            !isDraft,
            'Birthday is required.'
        ]
    },
    tin: {
        type: String,
        required: [
            !isDraft,
            'TIN is required.'
        ]
    },
    maritalStatus: {
        type: String,
        required: [
            !isDraft,
            'Marital Status is required.'
        ]
    },
    typeOfSeparation: {
        type: String
    },
    citizenship: {
        type: String,
        required: [
            !isDraft,
            'Citizenship is required.'
        ]
    },
    presentAddress: {
        ...address,
        lengthOfStay: {
            type: String,
            required: [
                !isDraft,
                'Length of Stay is required.'
            ]
        },
        ownership: {
            type: String
        },
        noOfDependents: {
            type: String,
            required: [
                !isDraft,
                'Number of dependents is required.'
            ]
        }
    },
    previousAddress: {
        ...address,
        lengthOfStay: {
            type: String,
            required: [
                !isDraft,
                'Length of Stay is required.'
            ]
        }
    },
    spouse: [ personalInformation ],
    applicantEmployment: employment(true),
    spouseEmployment: [ employment(false) ],
    vehiclePurchased,
    returnReason: {
        type: String
    },
    bankApplication: {
        type: [ ObjectId ],
        ref: 'BankApplication'
    },
    bankTransferRemarks: {
        type: String
    },
    cancelRemarks: {
        type: String
    },
    selectedBank: {
        type: 'ObjectId',
        ref: 'BankApplication'
    },
    dateReleased: {
        type: String
    },
    monthInvoice: {
        type: String
    },
    monthSubmitted: {
        type: String
    },
    unreleasedDate: {
        type: String
    },
    dateSubmitted: {
        type: String
    },
    recommendDate: {
        type: String
    },
    cancellationLetter: {
        type: attachment
    }
}

const schema = new Schema(applicationObj, {
    timestamps: {
        createdAt: 'dateCreated',
        updatedAt: 'dateUpdated'
    }
})

schema.pre('save', function () {
    if (this.status === 'submitted') {
        const dateToday = new Date().toISOString()
            .substr(0, 10)
        this.dateSubmitted = dateToday
    }
})
schema.pre('remove', (next) => {
    next()
})
schema.statics.dataView = {
    table: async (session) => {
        let match = {
        }
        const { User } = connection.models
        const currentUser = await User.findById(session.user)
        if (session.userType === 'External') {
            // eslint-disable-next-line eqeqeq
            if (session.userRole == 'finance') {
                match = {
                    $match: {
                        $expr: {
                            $in: [
                                '$vehiclePurchased.branch',
                                currentUser.multipleBranch
                            ]
                        }
                    }
                }
            }
            // eslint-disable-next-line eqeqeq
            else if (session.userRole == 'bankApprover') {
                match = {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $in: [
                                        currentUser.bank,
                                        "$vehiclePurchased.banks"
                                    ]
                                },
                                {
                                    $or: [
                                        {
                                            $eq: [
                                                "$status",
                                                "recommended"
                                            ]    
                                        },
                                        {
                                            $eq: [
                                                "$status",
                                                "approved"
                                            ]    
                                        },
                                        {
                                            $eq: [
                                                "$status",
                                                "rejected"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
            else {
                match = {
                    $match: {
                        $expr: {
                            $eq: [
                                "$user",
                                session.user 
                            ]
                        }
                    }
                }
            }
        }
        else if (session.userType === 'Internal') {
            // eslint-disable-next-line eqeqeq
            if (session.userRole == 'salesExecutive') {
                match = {
                    $match: {
                        $expr: {
                            $eq: [
                                "$vehiclePurchased.salesExecutive",
                                session.user
                            ]
                        }
                    }
                }
            }
            // eslint-disable-next-line eqeqeq
            else if (session.userRole == 'salesManager') {
                match = {
                    $match: {
                        $expr: {
                            $in: [
                                '$vehiclePurchased.branch',
                                currentUser.multipleBranch
                            ]
                        }
                    }
                }
            }
            // eslint-disable-next-line eqeqeq
            else if (session.userRole == 'superUser') {
                match = {
                    $match: {
                        _status: 'active',
                        'vehiclePurchased.banks': {
                            $elemMatch: {
                                $in: currentUser.superUserBank
                            }
                        },
                        'vehiclePurchased.branch': {
                            $in: currentUser.multipleBranch
                        }
                    }
                }
            }
            else {
                match = {
                    $match: {
                        $expr: {
                            $ne: [
                                "$status",
                                "draft"
                            ]
                        }
                    }
                }
            }
        }
        const arr = [
            ...aggregationHelper.to12HourString({
                fieldName: 'dateCreated'
            }),
            ...aggregationHelper.to12HourString({
                fieldName: 'dateUpdated'
            }),
            match,
            {
                $match: {
                    _status: {
                        $ne: 'deleted'
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'vehiclePurchased.salesExecutive',
                    foreignField: '_id',
                    as: 'salesExecutive'
                }
            },
            {
                $unwind: {
                    path: '$salesExecutive',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'vehicles',
                    localField: 'vehiclePurchased.variant',
                    foreignField: '_id',
                    as: 'unitRequired'
                }
            },
            {
                $unwind: {
                    path: '$unitRequired',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    name: {
                        $concat: [
                            '$user.firstName',
                            ' ',
                            '$user.lastName'
                        ]
                    },
                    salesExecutive: {
                        $concat: [
                            '$salesExecutive.firstName',
                            ' ',
                            '$salesExecutive.lastName'
                        ]
                    },
                    unitRequired: {
                        $concat: [
                            '$unitRequired.brand',
                            '-',
                            '$unitRequired.model',
                            '-',
                            '$unitRequired.variant',
                            '-',
                            '$unitRequired.year'
                        ]
                    }
                }
            }
        ]
        return arr
    },

    default: [
        ...aggregationHelper.to12HourString({
            fieldName: 'dateCreated'
        }),
        ...aggregationHelper.to12HourString({
            fieldName: 'dateUpdated'
        }),
        {
            $match: {
                _status: {
                    $ne: 'deleted'
                }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'users',
                foreignField: '_id',
                as: 'users'
            }
        },
        {
            $unwind: {
                path: '$users',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                name: {
                    $concat: [
                        '$users.firstName',
                        ' ',
                        '$users.lastName'
                    ]
                }
            }
        },
        {
            $addFields: {
                createdBy: '$_revision.author.userModel',
                updatedBy: '$_revision.author.userModel'
            }
        },
        {
            $unwind: {
                path: '$bankApplication',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'bankapplications',
                localField: 'bankApplication',
                foreignField: '_id',
                as: 'bankApplication'
            }
        },
        {
            $unwind: {
                path: '$bankApplication',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: '$_id',
                root: {
                    $mergeObjects: '$$ROOT'
                },
                bankApplication: {
                    $push: {
                        bankApplication: '$bankApplication'
                    }
                }
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        "$root",
                        "$$ROOT"
                    ]
                }
            }
        },
        {
            $project: {
                root: 0
            }
        },
        {
            $lookup: {
                from: 'bankapplications',
                localField: 'selectedBank',
                foreignField: '_id',
                as: 'selectedBank'
            }
        },
        {
            $unwind: {
                path: '$selectedBank',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'financingpartners',
                localField: 'selectedBank.bank',
                foreignField: '_id',
                as: 'selectedBank.bank'
            }
        },
        {
            $unwind: {
                path: '$selectedBank.bank',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                selectedBank: '$selectedBank._id',
                selectedBankName: '$selectedBank.bank.name'
            }
        },
        {
            $match: {
                _status: {
                    $ne: 'deleted'
                }
            }
        }
    ]
}
schema.statics.deleteNested = async function(data) {
    const { BankApplication } = connection.models
    
    const bankApplications = await BankApplication.find({
        application: data._id
    })

    await Promise.all(bankApplications.map(async (bankApplication) => {
        await BankApplication.findByIdAndDelete(bankApplication._id)
    }))
}

schema.statics.search = {
    default: function(search) {
        const searchAttributes = [
            'name',
            'salesExecutive',
            'unitRequired',
            'status'

        ]
        const searchFields = searchAttributes.map((attr) => ({
            [attr]: {
                $regex: search,
                $options: 'i'
            }
        }))
        return [].concat([
            statusEquivalent,
            {
                $match: {
                    $or: searchFields
                }
            },
            reverseStatusEquivalent
        ])
    }
}
const maxFileUploadSize = 5242880
schema.statics.upload = {
    validID: {
        dest: 'acfin-files',
        folder: 'valid-id',
        mimeTypes: [
            "image/jpeg",
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize
    },
    cancellationLetter: {
        dest: 'acfin-files',
        folder: 'cancellation-letter',
        mimeTypes: [
            "application/pdf",
            "application/vnd.ms-excel",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/octet-stream",
            "image/jpeg",
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize
    },
    localCOE: {
        dest: 'acfin-files',
        folder: 'local-coe',
        mimeTypes: [
            "application/pdf",
            "application/vnd.ms-excel",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/octet-stream",
            "image/jpeg",
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize
    },
    localPayslip: {
        dest: 'acfin-files',
        folder: 'local-payslip',
        mimeTypes: [
            "application/pdf",
            "application/vnd.ms-excel",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/octet-stream",
            "image/jpeg",
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize
    },
    localITR: {
        dest: 'acfin-files',
        folder: 'local-itr',
        mimeTypes: [
            "application/pdf",
            "application/vnd.ms-excel",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/octet-stream",
            "image/jpeg",
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize
    },
    ofwLandCOE: {
        dest: 'acfin-files',
        folder: 'ofw-land-coe',
        mimeTypes: [
            "application/pdf",
            "application/vnd.ms-excel",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/octet-stream",
            "image/jpeg",
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize
    },
    ofwLandPayslip: {
        dest: 'acfin-files',
        folder: 'ofw-land-payslip',
        mimeTypes: [
            "application/pdf",
            "application/vnd.ms-excel",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/octet-stream",
            "image/jpeg",
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize
    },
    ofwLandRemittance: {
        dest: 'acfin-files',
        folder: 'ofw-land-remittance',
        mimeTypes: [
            "application/pdf",
            "application/vnd.ms-excel",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/octet-stream",
            "image/jpeg",
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize
    },
    ofwSeaCOE: {
        dest: 'acfin-files',
        folder: 'ofw-sea-coe',
        mimeTypes: [
            "application/pdf",
            "application/vnd.ms-excel",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/octet-stream",
            "image/jpeg",
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize
    },
    ofwSeaPayslip: {
        dest: 'acfin-files',
        folder: 'ofw-sea-payslip',
        mimeTypes: [
            "application/pdf",
            "application/vnd.ms-excel",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/octet-stream",
            "image/jpeg",
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize
    },
    ofwSeaAllotment: {
        dest: 'acfin-files',
        folder: 'ofw-sea-allotment',
        mimeTypes: [
            "application/pdf",
            "application/vnd.ms-excel",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/octet-stream",
            "image/jpeg",
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize
    },
    borrowerSignature: {
        dest: 'acfin-files',
        folder: 'borrower-signature',
        mimeTypes: [
            "image/jpeg",
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize
    },
    spouseSignature: {
        dest: 'acfin-files',
        folder: 'spouse-signature',
        mimeTypes: [
            "image/jpeg",
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize
    },
    ofwSeaTip: {
        dest: 'acfin-files',
        folder: 'ofw-sea-tip',
        mimeTypes: [
            "application/pdf",
            "application/vnd.ms-excel",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/octet-stream",
            "image/jpeg",
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize
    },
    ofwSeaVoucher: {
        dest: 'acfin-files',
        folder: 'ofw-sea-voucher',
        mimeTypes: [
            "application/pdf",
            "application/vnd.ms-excel",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/octet-stream",
            "image/jpeg",
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize
    }
}
schema.statics.fileMapping = {
    validID: [
        'vehiclePurchased',
        'validID'
    ],
    localCOE: [
        'vehiclePurchased',
        'local',
        'coe',
        'attachment'
    ],
    localPayslip: [
        'vehiclePurchased',
        'local',
        'payslip',
        'attachment'
    ],
    localITR: [
        'vehiclePurchased',
        'local',
        'itr',
        'attachment'
    ],
    ofwLandCOE: [
        'vehiclePurchased',
        'ofwLandBased',
        'coe',
        'attachment'
    ],
    ofwLandPayslip: [
        'vehiclePurchased',
        'ofwLandBased',
        'payslip',
        'attachment'
    ],
    ofwLandRemittance: [
        'vehiclePurchased',
        'ofwLandBased',
        'remittance',
        'attachment'
    ],
    ofwSeaCOE: [
        'vehiclePurchased',
        'ofwSeaBased',
        'coe',
        'attachment'
    ],
    ofwSeaPayslip: [
        'vehiclePurchased',
        'ofwSeaBased',
        'payslip',
        'attachment'
    ],
    ofwSeaAllotment: [
        'vehiclePurchased',
        'ofwSeaBased',
        'allotment',
        'attachment'
    ],
    ofwSeaTip: [
        'vehiclePurchased',
        'ofwSeaBased',
        'tip',
        'attachment'
    ],
    ofwSeaVoucher: [
        'vehiclePurchased',
        'ofwSeaBased',
        'voucher',
        'attachment'
    ],
    borrowerSignature: [
        'vehiclePurchased',
        'borrowerSignature'
    ],
    spouseSignature: [
        'vehiclePurchased',
        'spouseSignature'
    ]
}
schema.plugin(autopopulate) 
const modifiedSchema = schemaFactory(schema)
const model = modelFactory({
    schema: modifiedSchema,
    modelName: 'Application'
})

module.exports = model