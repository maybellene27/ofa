/* eslint-disable new-cap */
const { ObjectId } = require('mongoose').Types

// eslint-disable-next-line max-params
module.exports = (company, bank, branch, year) => [
    {
        $match: {
            recommendDate: {
                $regex: `^${year}`
            },
            bank: ObjectId(bank),
            'vehiclePurchased.branch': {
                $eq: ObjectId(branch)
            }
        }
    },
    {
        $lookup: {
            from: 'applications',
            localField: 'application',
            foreignField: '_id',
            as: 'application'
        }
    },
    {
        $unwind: {
            path: '$application',
            preserveNullAndEmptyArrays: true
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
            application: '$application.application',
            bank: '$bank.name',
            submittedDate: {
                $dateFromString: {
                    dateString: '$recommendDate'
                }
            }
        }
    },
    {
        $addFields: {
            submittedMonth: {
                $month: {
                    date: '$submittedDate'
                }
            },
            submittedYear: {
                $year: {
                    date: '$submittedDate'
                }
            }
        }
    },
    {
        $lookup: {
            from: 'branches',
            localField: 'vehiclePurchased.branch',
            foreignField: '_id',
            as: 'company'
        }
    },
    {
        $unwind: {
            path: '$company',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $addFields: {
            company: '$company.company'
        }
    },
    {
        $match: {
            company: {
                $eq: ObjectId(company)
            }
        }
    },
    {
        $facet: {
            approved: [
                {
                    $match: {
                        $or: [
                            {
                                bankStatus: 'Approved and Unreleased'
                            },
                            {
                                bankStatus: 'Approved and Released'
                            }
                        ]
                    }
                },
                {
                    $group: {
                        _id: {
                            submittedMonth: '$submittedMonth'
                        },
                        totalApplications: {
                            $sum: 1
                        }
                    }
                },
                {
                    $addFields: {
                        submittedMonth: '$_id.submittedMonth'
                    }
                },
                {
                    $project: {
                        submittedMonth: 1,
                        totalApplications: 1,
                        _id: 0
                    }
                }
            ],
            declined: [
                {
                    $match: {
                        bankStatus: 'Declined'
                    }
                },
                {
                    $group: {
                        _id: {
                            submittedMonth: '$submittedMonth'
                        },
                        totalApplications: {
                            $sum: 1
                        }
                    }
                },
                {
                    $addFields: {
                        submittedMonth: '$_id.submittedMonth'
                    }
                },
                {
                    $project: {
                        submittedMonth: 1,
                        totalApplications: 1,
                        _id: 0
                    }
                }
            ],
            withAddtlBankRequirements: [
                {
                    $match: {
                        bankStatus: 'Returned'
                    }
                },
                {
                    $group: {
                        _id: {
                            submittedMonth: '$submittedMonth'
                        },
                        totalApplications: {
                            $sum: 1
                        }
                    }
                },
                {
                    $addFields: {
                        submittedMonth: '$_id.submittedMonth'
                    }
                },
                {
                    $project: {
                        submittedMonth: 1,
                        totalApplications: 1,
                        _id: 0
                    }
                }
            ],
            noStatusYet: [
                {
                    $match: {
                        bankStatus: 'Pending Approval'
                    }
                },
                {
                    $group: {
                        _id: {
                            submittedMonth: '$submittedMonth'
                        },
                        totalApplications: {
                            $sum: 1
                        }
                    }
                },
                {
                    $addFields: {
                        submittedMonth: '$_id.submittedMonth'
                    }
                },
                {
                    $project: {
                        submittedMonth: 1,
                        totalApplications: 1,
                        _id: 0
                    }
                }
            ],
            notSentToThisBank: [
                {
                    $group: {
                        _id: {
                            submittedYear: '$submittedYear',
                            submittedMonth: '$submittedMonth'
                        },
                        totalApplications: {
                            $sum: 1
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'applications',
                        pipeline: [
                            {
                                $match: {
                                    status: 'submitted',
                                    dateSubmitted: {
                                        $regex: `^${year}`
                                    },
                                    'vehiclePurchased.banks': ObjectId(bank)
                                }
                            },
                            {
                                $addFields: {
                                    submittedDate: {
                                        $dateFromString: {
                                            dateString: '$dateSubmitted'
                                        }
                                    }
                                }
                            },
                            {
                                $addFields: {
                                    submittedYear: {
                                        $year: {
                                            date: '$submittedDate'
                                        }
                                    },
                                    submittedMonth: {
                                        $month: {
                                            date: '$submittedDate'
                                        }
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        submittedYear: '$submittedYear',
                                        submittedMonth: '$submittedMonth'
                                    },
                                    totalApplications: {
                                        $sum: 1
                                    }
                                }
                            }
                        ],
                        as: 'totalApplications'
                    }
                },
                {
                    $addFields: {
                        totalApplications: '$totalApplications.totalApplications'
                    }
                },
                {
                    $unwind: {
                        path: '$totalApplications',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'applications',
                        pipeline: [
                            {
                                $match: {
                                    status: 'submitted',
                                    dateSubmitted: {
                                        $regex: `^${year}`
                                    },
                                    'vehiclePurchased.banks': ObjectId(bank)
                                }
                            },
                            {
                                $addFields: {
                                    banks: '$vehiclePurchased.banks',
                                    submittedDate: {
                                        $dateFromString: {
                                            dateString: '$dateSubmitted'
                                        }
                                    }
                                }
                            },

                            {
                                $addFields: {
                                    submittedDate: {
                                        $dateFromString: {
                                            dateString: '$dateSubmitted'
                                        }
                                    }
                                }
                            },
                            {
                                $addFields: {
                                    submittedYear: {
                                        $year: {
                                            date: '$submittedDate'
                                        }
                                    },
                                    submittedMonth: {
                                        $month: {
                                            date: '$submittedDate'
                                        }
                                    }
                                }
                            },
                            {
                                $unwind: '$banks'
                            },
                            {
                                $lookup: {
                                    from: 'financingpartners',
                                    localField: 'banks',
                                    foreignField: '_id',
                                    as: 'banks'
                                }
                            },
                            {
                                $unwind: {
                                    path: '$banks',
                                    preserveNullAndEmptyArrays: true
                                }
                            },
                            {
                                $addFields: {
                                    banks: '$banks.name'
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        submittedMonth: '$submittedMonth'
                                    },
                                    totalApplications: {
                                        $sum: 1
                                    }
                                }
                            },
                            {
                                $addFields: {
                                    submittedMonth: '$_id.submittedMonth'
                                }
                            },
                            {
                                $project: {
                                    submittedMonth: 1,
                                    totalApplications: 1,
                                    _id: 0
                                }
                            }
                        ],
                        as: 'notSentToThisBank'
                    }
                },
                {
                    $project: {
                        notSentToThisBank: 1
                    }
                }
                
            ]
        }
    },
    {
        $addFields: {
            notSentToThisBank: '$notSentToThisBank.notSentToThisBank'
        }
    },
    {
        $addFields: {
            notSentToThisBank: {
                $first: '$notSentToThisBank'
            }
        }
    },
    {
        $addFields: {
            totals: {
                $concatArrays: [
                    '$approved',
                    '$declined',
                    '$withAddtlBankRequirements',
                    '$noStatusYet',
                    '$notSentToThisBank'
                ]
            }
        }
    },
    {
        $unwind: {
            path: '$totals',
            preserveNullAndEmptyArrays: true 
        }
    },
    {
        $addFields: {
            submittedMonth: '$totals.submittedMonth',
            totalApplications: '$totals.totalApplications'
        }
    },
    {
        $facet: {
            approved: [
                {
                    $group: {
                        _id: {
                            approved: '$approved'
                        }
                    }
                },
                {
                    $addFields: {
                        approved: '$_id.approved'
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ],
            declined: [
                {
                    $group: {
                        _id: {
                            declined: '$declined'
                        }
                    }
                },
                {
                    $addFields: {
                        declined: '$_id.declined'
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ],
            withAddtlBankRequirements: [
                {
                    $group: {
                        _id: {
                            withAddtlBankRequirements: '$withAddtlBankRequirements'
                        }
                    }
                },
                {
                    $addFields: {
                        withAddtlBankRequirements: '$_id.withAddtlBankRequirements'
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ],
            noStatusYet: [
                {
                    $group: {
                        _id: {
                            noStatusYet: '$noStatusYet'
                        }
                    }
                },
                {
                    $addFields: {
                        noStatusYet: '$_id.noStatusYet'
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ],
            notSentToThisBank: [
                {
                    $group: {
                        _id: {
                            notSentToThisBank: '$notSentToThisBank'
                        }
                    }
                },
                {
                    $addFields: {
                        notSentToThisBank: '$_id.notSentToThisBank'
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ],
            grandTotal: [
                {
                    $group: {
                        _id: {
                            submittedMonth: '$submittedMonth'
                        },
                        totalApplications: {
                            $sum: '$totalApplications'
                        }
                    }
                },
                {
                    $addFields: {
                        submittedMonth: '$_id.submittedMonth'
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ],
            companyName: [
                {
                    $lookup: {
                        from: 'companies',
                        pipeline: [
                            {
                                $match: {
                                    _id: ObjectId(company)
                                }
                            }
                        ],
                        as: 'companyName'
                    }
                },
                {
                    $unwind: {
                        path: '$companyName'
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: '$companyName'
                    }
                },
                {
                    $group: {
                        _id: {
                            name: '$name'
                        }
                    }
                }
            ],
            bankName: [
                {
                    $lookup: {
                        from: 'financingpartners',
                        pipeline: [
                            {
                                $match: {
                                    _id: ObjectId(bank)
                                }
                            }
                        ],
                        as: 'bank'
                    }
                },
                {
                    $unwind: {
                        path: '$bank'
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: '$bank'
                    }
                },
                {
                    $group: {
                        _id: {
                            name: '$name'
                        }
                    }
                }
            ],
            branchName: [
                {
                    $lookup: {
                        from: 'branches',
                        pipeline: [
                            {
                                $match: {
                                    _id: ObjectId(branch)
                                }
                            }
                        ],
                        as: 'branchName'
                    }
                },
                {
                    $unwind: {
                        path: '$branchName'
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: '$branchName'
                    }
                },
                {
                    $group: {
                        _id: {
                            name: '$name'
                        }
                    }
                }
            ]
        }
    },
    {
        $unwind: {
            path: '$approved',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $unwind: {
            path: '$declined',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $unwind: {
            path: '$withAddtlBankRequirements',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $unwind: {
            path: '$noStatusYet',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $unwind: {
            path: '$notSentToThisBank',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $unwind: {
            path: '$companyName',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $unwind: {
            path: '$bankName',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $unwind: {
            path: '$branchName',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $addFields: {
            approved: '$approved.approved',
            declined: '$declined.declined',
            withAddtlBankRequirements: '$withAddtlBankRequirements.withAddtlBankRequirements',
            noStatusYet: '$noStatusYet.noStatusYet',
            notSentToThisBank: '$notSentToThisBank.notSentToThisBank',
            companyName: '$companyName._id.name',
            bankName: '$bankName._id.name',
            branchName: '$branchName._id.name',
            year: Number(year)
        }
    }
]