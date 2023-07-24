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
                brand: '$vehiclePurchased.brand',
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
                                brand: '$brand',
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
                            brand: '$_id.brand',
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
                            _id: '$brand',
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
                                brand: '$brand',
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
                            brand: '$_id.brand',
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
                                brand: '$brand',
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
                            _id: '$_id.brand',
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
                                brand: '$brand',
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
                            brand: '$_id.brand',
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
                                brand: '$brand',
                                monthSubmitted: '$application.submittedMonth',
                                yearSubmitted: '$application.submittedYear'
                            },
                            applications: {
                                $push: {
                                    brand: '$brand',
                                    totalInvoiced: '$totalInvoiced'
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: '$_id.brand',
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
            $addFields: {
                filter: '$_id',
                previousYear,
                currentYear
            }
        },
        {
            $lookup: {
                from: 'applications',
                let: {
                    brand: '$_id'
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
                            brand: '$vehiclePurchased.brand'
                        }
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    '$brand',
                                    '$$brand'
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
                                brand: '$brand',
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
                            brand: '$_id.brand',
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
                            _id: '$brand',
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