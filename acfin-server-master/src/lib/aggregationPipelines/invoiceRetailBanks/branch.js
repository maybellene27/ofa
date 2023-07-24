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
                _status: 'active',
                bankStatus: 'Approved and Released'
            }
        },
        {
            $addFields: {
                branch: '$vehiclePurchased.branch',
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
                            submittedYear: currentYear
                        }
                    },
                    {
                        $group: {
                            _id: {
                                branch: '$branch',
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
                            branch: '$_id.branch',
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
                            _id: '$branch',
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
                            submittedYear: currentYear
                        }
                    },
                    {
                        $group: {
                            _id: {
                                branch: '$branch',
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
                            branch: '$_id.branch',
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
                                branch: '$branch',
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
                            _id: '$_id.branch',
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
                            submittedYear: previousYear
                        }
                    },
                    {
                        $group: {
                            _id: {
                                branch: '$branch',
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
                            branch: '$_id.branch',
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
                                branch: '$branch',
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
                            _id: '$_id.branch',
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
                from: 'branches',
                localField: '_id',
                foreignField: '_id',
                as: 'branch'
            }
        },
        {
            $unwind: {
                path: '$branch',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                filter: '$branch.name',
                previousYear,
                currentYear
            }
        },
        {
            $lookup: {
                from: 'applications',
                let: {
                    branch: '$_id'
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
                        $addFields: {
                            branch: '$vehiclePurchased.branch'
                        }
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    '$branch',
                                    '$$branch'
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
                                branch: '$branch',
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
                            branch: '$_id.branch',
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
                            _id: '$branch',
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