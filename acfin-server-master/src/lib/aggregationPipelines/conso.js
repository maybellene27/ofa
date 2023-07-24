/* eslint-disable new-cap */
const bankApplicationModel = require('../../models/bankApplication')

module.exports = async (year) => {
    const count = await bankApplicationModel.countDocuments({
        monthInvoice: {
            $regex: `^${year}`
        },
        bankStatus: {
            $eq: 'Approved and Released'
        }
    })
    const pipeline = [
        {
            $match: {
                monthInvoice: {
                    $regex: `^${year}`
                },
                bankStatus: {
                    $eq: 'Approved and Released'
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
                bank: '$bank.name'
            }
        },
        {
            $facet: {
                total: [
                    {
                        $group: {
                            _id: {
                                bank: '$bank'
                            },
                            total: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $addFields: {
                            percent: {
                                $multiply: [
                                    {
                                        $divide: [
                                            '$total',
                                            count
                                        ]
                                    },
                                    100
                                ]
                            }
                        }
                    },
                    {
                        $sort: {
                            total: -1
                        }
                    }
                ],
                topFour: [
                    {
                        $group: {
                            _id: {
                                bank: '$bank'
                            },
                            total: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $addFields: {
                            percent: {
                                $multiply: [
                                    {
                                        $divide: [
                                            '$total',
                                            count
                                        ]
                                    },
                                    100
                                ]
                            }
                        }
                    },
                    {
                        $sort: {
                            total: -1
                        }
                    },
                    {
                        $limit: 4
                    }
                ]
            }
        },
        {
            $addFields: {
                count: count,
                year: year
            }
        }
    ]

    return pipeline
}