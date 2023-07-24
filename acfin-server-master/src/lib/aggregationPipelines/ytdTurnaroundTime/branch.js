/* eslint-disable new-cap */
const { ObjectId } = require('mongoose').Types

module.exports = (company, branch, year) => [
    {
        $facet: {
            turnaroundTime: [
                {
                    $match: {
                        recommendDate: {
                            $regex: `^${year}`
                        },
                        'vehiclePurchased.branch': {
                            $eq: ObjectId(branch)
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
                        bank: '$bank.name',
                        branch: '$company.name',
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
                    $lookup: {
                        from: 'companies',
                        localField: 'company',
                        foreignField: '_id',
                        as: 'company'
                    }
                },
                {
                    $project: {
                        recommendDate: 1,
                        bankApproveDate: 1,
                        company: 1,
                        bank: 1
                    }
                },
                {
                    $addFields: {
                        recommendDate: {
                            $dateFromString: {
                                dateString: '$recommendDate'
                            }
                        },
                        bankApproveDate: {
                            $dateFromString: {
                                dateString: '$bankApproveDate'
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        recommendedMonth: {
                            $month: {
                                date: '$recommendDate'
                            }
                        },
                        turnaroundTime: {
                            $divide: [
                                {
                                    $subtract: [
                                        '$bankApproveDate',
                                        '$recommendDate'
                                    ]
                                },
                                1000 * 60 * 60 * 24
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            recommendedMonth: '$recommendedMonth',
                            bank: '$bank'
                        },
                        averageTurnaroundTime: {
                            $avg: '$turnaroundTime'
                        }
                    }
                },
                {
                    $project: {
                        _id: '$_id',
                        averageTurnaroundTime: {
                            $ceil: '$averageTurnaroundTime' 
                        }
                    }
                }
            ],
            company: [
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
                    $lookup: {
                        from: 'companies',
                        localField: 'company',
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
                        company: '$company.name'
                    }
                },
                {
                    $project: {
                        company: 1
                    }
                },
                {
                    $group: {
                        _id: {
                            company: '$company'
                        }
                    }
                }
            ],
            branch: [
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
                        branch: '$company.name'
                    }
                },
                {
                    $project: {
                        branch: 1
                    }
                },
                {
                    $group: {
                        _id: {
                            branch: '$branch'
                        }
                    }
                }
            ]
        }
    },
    {
        $unwind: {
            path: '$company',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $unwind: {
            path: '$branch',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            turnaroundTime: 1,
            company: '$company._id.company',
            branch: '$branch._id.branch',
            year: year
        }
    }
]