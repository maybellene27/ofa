/* eslint-disable new-cap */
const { Types } = require('mongoose')
const { ObjectId } = Types

module.exports = {
    financingPartner: ({ type, branch, brand }) => {
        let pipeline = []
        const dateToday = new Date().toISOString()
            .substr(0, 10)
        if (type === 'Branch') {
            pipeline = [
                {
                    $facet: {
                        banks: [
                            {
                                $match: {
                                    _status: {
                                        $ne: 'deleted'
                                    }
                                }
                            },
                            {
                                $match: {
                                    branch: {
                                        $in: [ ObjectId(branch) ]
                                    }
                                }
                            },
                            {
                                $addFields: {
                                    dateExported: dateToday
                                }
                            }
                        ]
                    }
                },
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
                        dateExported: dateToday
                    }
                }
            ]
        }
        else if (type === 'Brand') {
            pipeline = [
                {
                    $facet: {
                        banks: [
                            {
                                $match: {
                                    _status: {
                                        $ne: 'deleted'
                                    }
                                }
                            },
                            {
                                $match: {
                                    brand: {
                                        $in: [ brand ]
                                    }
                                }
                            },
                            {
                                $addFields: {
                                    dateExported: dateToday
                                }
                            }
                        ]
                    }
                },
                {
                    $addFields: {
                        dateExported: dateToday,
                        brand: brand
                    }
                }
            ]
        }    
        return pipeline
    }
}