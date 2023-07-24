module.exports = (year) => {
    const currentYear = Number(year)
    const previousYear = currentYear - 1
    const match = {
        $match: {
            $or: [
                {
                    submittedYear: currentYear
                },
                {
                    $and: [
                        {
                            submittedYear: previousYear
                        },
                        {
                            invoicedYear: currentYear
                        }
                    ]
                }
            ]
        }
    }
    return [
        {
            $match: {
                _status: 'active'
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
            $addFields: {
                submittedDate: {
                    $dateFromString: {
                        dateString: '$dateSubmitted'
                    }
                },
                approvedDate: {
                    $dateFromString: {
                        dateString: '$dateReleased'
                    }
                },
                invoicedDate: {
                    $dateFromString: {
                        dateString: '$monthInvoice'
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
                },
                approvedMonth: {
                    $month: {
                        date: '$approvedDate'
                    }
                },
                approvedYear: {
                    $year: {
                        date: '$approvedDate'
                    }
                },
                invoicedMonth: {
                    $month: {
                        date: '$invoicedDate'
                    }
                },
                invoicedYear: {
                    $year: {
                        date: '$invoicedDate'
                    }
                }
            }
        },
        match,
        {
            $facet: {
                totalApproved: [
                    {
                        $match: {
                            bankStatus: 'Approved and Released',
                            submittedYear: currentYear
                        }
                    },
                    {
                        $group: {
                            _id: {
                                company: '$company',
                                monthApproved: '$approvedMonth',
                                yearApproved: '$approvedYear'
                            },
                            totalApproved: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $project: {
                            company: '$_id.company',
                            monthApproved: '$_id.monthApproved',
                            yearApproved: '$_id.yearApproved',
                            totalApproved: '$totalApproved'
                        }
                    }, 
                    {
                        $match: {
                            monthApproved: {
                                $ne: null
                            },
                            yearApproved: {
                                $ne: null
                            }
                        }
                    },
                    {
                        $group: {
                            _id: '$company',
                            totalApproved: {
                                $push: {
                                    monthApproved: '$monthApproved',
                                    yearApproved: '$yearApproved',
                                    totalApproved: '$totalApproved'
                                }
                            }
                        }
                    }
                ],
                totalInvoiced: [
                    {
                        $match: {
                            bankStatus: 'Approved and Released',
                            submittedYear: currentYear
                        }
                    },
                    {
                        $group: {
                            _id: {
                                company: '$company',
                                bank: '$bank'
                            },
                            totalInvoiced: {
                                $sum: 1
                            },
                            application: {
                                $push: '$$ROOT'
                            }
                        }
                    },
                    {
                        $project: {
                            company: '$_id.company',
                            bank: '$_id.bank',
                            totalInvoiced: 1,
                            _id: 0,
                            application: 1
                        }
                    },
                    {
                        $unwind: {
                            path: '$application',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $group: {
                            _id: {
                                company: '$company',
                                monthSubmitted: '$application.submittedMonth',
                                yearSubmitted: '$application.submittedYear'
                            },
                            applications: {
                                $push: {
                                    bank: '$bank',
                                    totalInvoiced: '$totalInvoiced'
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: '$_id.company',
                            monthSubmitted: '$_id.monthSubmitted',
                            yearSubmitted: '$_id.yearSubmitted',
                            applications: 1
                        }
                    },
                    {
                        $group: {
                            _id: '$_id',
                            totalInvoiced: {
                                $push: '$$ROOT'
                            }
                        }
                    }
                ],
                previousTotalInvoiced: [
                    {
                        $match: {
                            bankStatus: 'Approved and Released',
                            submittedYear: previousYear
                        }
                    },
                    {
                        $group: {
                            _id: {
                                company: '$company',
                                bank: '$bank'
                            },
                            totalInvoiced: {
                                $sum: 1
                            },
                            application: {
                                $push: '$$ROOT'
                            }
                        }
                    },
                    {
                        $project: {
                            company: '$_id.company',
                            bank: '$_id.bank',
                            totalInvoiced: 1,
                            _id: 0,
                            application: 1
                        }
                    },
                    {
                        $unwind: {
                            path: '$application',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $group: {
                            _id: {
                                company: '$company',
                                monthSubmitted: '$application.submittedMonth',
                                yearSubmitted: '$application.submittedYear'
                            },
                            applications: {
                                $push: {
                                    bank: '$bank',
                                    totalInvoiced: '$totalInvoiced'
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: '$_id.company',
                            monthSubmitted: '$_id.monthSubmitted',
                            yearSubmitted: '$_id.yearSubmitted',
                            applications: 1
                        }
                    },
                    {
                        $group: {
                            _id: '$_id',
                            previousTotalInvoiced: {
                                $push: '$$ROOT'
                            }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                merge: {
                    $concatArrays: [
                        '$totalApproved',
                        '$totalInvoiced',
                        '$previousTotalInvoiced'
                    ]
                }
            }
        },
        {
            $unwind: {
                path: '$merge',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $replaceRoot: {
                newRoot: '$merge' 
            }
        },
        {
            $unwind: {
                path: '$totalApproved',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$totalInvoiced',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$previousTotalInvoiced',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: '$_id',
                totalApproved: {
                    $push: '$totalApproved'
                },
                totalInvoiced: {
                    $push: '$totalInvoiced'
                },
                previousTotalInvoiced: {
                    $push: '$previousTotalInvoiced'
                }
            }
        },
        {
            $lookup: {
                from: 'companies',
                localField: '_id',
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
                filter: '$company.name',
                previousYear,
                currentYear
            }
        },
        {
            $lookup: {
                from: 'applications',
                let: {
                    company: '$_id'
                },
                pipeline: [
                    {
                        $match: {
                            _status: 'active',
                            status: {
                                $ne: 'draft'
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
                            $expr: {
                                $eq: [
                                    '$company',
                                    '$$company'
                                ]
                            }
                        }
                    },
                    {
                        $addFields: {
                            submittedDate: {
                                $dateFromString: {
                                    dateString: '$dateSubmitted'
                                }
                            },
                            approvedDate: {
                                $dateFromString: {
                                    dateString: '$dateReleased'
                                }
                            },
                            invoicedDate: {
                                $dateFromString: {
                                    dateString: '$monthInvoice'
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
                            },
                            approvedMonth: {
                                $month: {
                                    date: '$approvedDate'
                                }
                            },
                            approvedYear: {
                                $year: {
                                    date: '$approvedDate'
                                }
                            },
                            invoicedMonth: {
                                $month: {
                                    date: '$invoicedDate'
                                }
                            },
                            invoicedYear: {
                                $year: {
                                    date: '$invoicedDate'
                                }
                            }
                        }
                    },
                    {
                        $match: {
                            submittedYear: currentYear
                        }
                    },
                    {
                        $group: {
                            _id: {
                                company: '$company',
                                monthSubmitted: '$submittedMonth',
                                yearSubmitted: '$submittedYear'
                            },
                            totalApplication: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $project: {
                            company: '$_id.company',
                            monthSubmitted: '$_id.monthSubmitted',
                            yearSubmitted: '$_id.yearSubmitted',
                            totalApplication: '$totalApplication'
                        }
                    },
                    {
                        $match: {
                            monthSubmitted: {
                                $ne: null
                            },
                            yearSubmitted: {
                                $ne: null
                            }
                        }
                    },
                    {
                        $group: {
                            _id: '$company',
                            totalApplication: {
                                $push: {
                                    monthSubmitted: '$monthSubmitted',
                                    yearSubmitted: '$yearSubmitted',
                                    totalApplication: '$totalApplication'
                                }
                            }
                        }
                    }
                ],
                as: 'applications'
            }
        },
        {
            $unwind: {
                path: '$applications',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                totalApplication: '$applications.totalApplication'
            }
        }
    ]
}