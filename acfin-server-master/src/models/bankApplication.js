// Rule is needed to be disabled for Mongoose
/* eslint-disable no-invalid-this */
// Rule is needed to be disabled for the ObjectId to be parsed correctly
/* eslint-disable new-cap */
const { Schema, connection } = require('mongoose')
const { schemaFactory, modelFactory } = require('mongodb-plugin')
const autopopulate = require('mongoose-autopopulate')
const address = require('../schema/address')
const personalInformation = require('../schema/personalInformation')
const employment = require('../schema/employment')
const vehiclePurchased = require('../schema/vehiclePurchased')

const {
    padDates = true,
    padTimes = true
} = require('../config/meta')

const aggregationHelper = require('../lib/aggregationHelpers')({
    padDates,
    padTimes
})
const isDraft = function () {
    return this.status === 'draft'
}
const schema = new Schema(
    {
        bank: {
            type: "ObjectId",
            ref: "FinancingPartner",
            required: [
                true,
                'Bank is required.'
            ]
        },
        approvalAge: {
            type: Number,
            default: 0
        },
        releaseAge: {
            type: Number,
            default: 0
        },
        application: {
            type: "ObjectId",
            ref: "Application",
            required: [
                true,
                'Application is required.'
            ]
        },
        user: {
            type: 'ObjectId',
            ref: 'User',
            required: [
                true,
                'User is required'
            ]
        },
        bankStatus: {
            type: String,
            enum: [
                'Pending Approval',
                'Approved and Unreleased',
                'Approved and Released',
                'Not Applicable',
                'Declined',
                'Returned',
                'Expired',
                'Release Expired',
                'Cancelled'
            ],
            default: 'Pending Approval'
        },
        declineReason: {
            type: "String"
        },
        //application
        consentClause: {
            type: Boolean,
            default: false
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
                'releaseExpired',
                'unreleased',
                'cancelled'
            ],
            default: 'draft'
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
        bankReturnReason: {
            type: String
        },
        dateSubmitted: {
            type: String
        },
        recommendDate: {
            type: String
        },
        bankApproveDate: {
            type: String
        },
        bankReturnedDate: {
            type: String
        },
        bankDeclinedDate: {
            type: String
        }
    }, 
    {
        timestamps: {
            createdAt: 'dateCreated',
            updatedAt: 'dateUpdated'
        }
    }
)

schema.pre('save', (next) => {
    next()
})

schema.pre('remove', (next) => {
    next()
})
const maxFileUploadSize = 5242880
schema.statics.upload = {
    validID: {
        dest: 'acfin-files',
        folder: 'bank-valid-id',
        mimeTypes: [
            "image/jpeg",
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize
    },
    localCOE: {
        dest: 'acfin-files',
        folder: 'bank-local-coe',
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
        folder: 'bank-local-payslip',
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
        folder: 'bank-local-itr',
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
        folder: 'bank-ofw-land-coe',
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
        folder: 'bank-ofw-land-payslip',
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
        folder: 'bank-ofw-land-remittance',
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
        folder: 'bank-ofw-sea-coe',
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
        folder: 'bank-ofw-sea-payslip',
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
        folder: 'bank-ofw-sea-allotment',
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
        folder: 'bank-borrower-signature',
        mimeTypes: [
            "image/jpeg",
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize
    },
    spouseSignature: {
        dest: 'acfin-files',
        folder: 'bank-spouse-signature',
        mimeTypes: [
            "image/jpeg",
            "image/png"
        ],
        maxCount: 50,
        maxFileUploadSize
    },
    ofwSeaTip: {
        dest: 'acfin-files',
        folder: 'bank-ofw-sea-tip',
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
        folder: 'bank-ofw-sea-voucher',
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
schema.statics.dataView = {
    default: [
        ...aggregationHelper.to12HourString({
            fieldName: 'dateCreated'
        }),
        ...aggregationHelper.to12HourString({
            fieldName: 'dateUpdated'
        }),
        {
            $addFields: {
                createdBy: '$_revision.author.userModel',
                updatedBy: '$_revision.author.userModel'
            }
        },
        {
            $match: {
                _status: {
                    $ne: 'deleted'
                }
            }
        },
        {
            $lookup: {
                from: 'financingpartners',
                localField: 'bank',
                foreignField: '_id',
                as: 'bank'
            }
        },
        {
            $unwind: {
                path: '$bank',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                bankName: '$bank.name',
                financePartnerID: '$bank._id'
            }
        },
        {
            $project: {
                bank: 0
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
        }
    ],
    application: async (session) => {
        let match = {
        }
        const { User } = connection.models
        const currentUser = await User.findById(session.user)
        // eslint-disable-next-line eqeqeq
        if (session.userRole == 'bankApprover') {
            match = {
                $match: {
                    $and: [
                        {
                            $expr: {
                                $eq: [
                                    "$bank",
                                    currentUser.bank
                                ]
                            }
                        },
                        {
                            "vehiclePurchased.branch": {
                                $in: currentUser.multipleBranch
                            }
                        },
                        {
                            "vehiclePurchased.brand": {
                                $in: currentUser.brand
                            }
                        }
                    ]
                }
            }
        }
        const pipeline = [
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
                $addFields: {
                    name: {
                        $concat: [
                            '$user.firstName',
                            ' ',
                            '$user.lastName'
                        ]
                    }
                }
            }
        ]
        return pipeline
    }
}

schema.statics.search = {
    default: function(search) {
        const searchAttributes = [
            'name',
            'presentAddress.ownership',
            'applicantEmployment.type',
            'bankStatus'

        ]
        const searchFields = searchAttributes.map((attr) => ({
            [attr]: {
                $regex: search,
                $options: 'i'
            }
        }))
        
        return [].concat([
            {
                $match: {
                    $or: searchFields
                }
            }
        ])
    }
}


schema.plugin(autopopulate) 
const modifiedSchema = schemaFactory(schema)
const model = modelFactory({
    schema: modifiedSchema,
    modelName: 'BankApplication'
})

module.exports = model