/* eslint-disable new-cap */
const { Types } = require('mongoose')
const { ObjectId } = Types
const { brand, branch, company } = require('../aggregationPipelines/invoiceRetailMonthly')

module.exports = {
    application: ({ _id }) => [
        {
            $match: {
                _id: ObjectId(_id)
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
                'presentAddress.barangay': {
                    $cond: [
                        {
                            $or: [
                                {
                                    $eq: [
                                        '$presentAddress.barangay',
                                        ''
                                    ]
                                },
                                {
                                    $eq: [
                                        '$presentAddress.barangay',
                                        null
                                    ]
                                }
                            ]
                        },
                        null,
                        {
                            $toObjectId: '$presentAddress.barangay'
                        }
                    ]
                },
                'presentAddress.city': {
                    $cond: [
                        {
                            $or: [
                                {
                                    $eq: [
                                        '$presentAddress.city',
                                        ''
                                    ]
                                },
                                {
                                    $eq: [
                                        '$presentAddress.city',
                                        null
                                    ]
                                }
                            ]
                        },
                        null,
                        {
                            $toObjectId: '$presentAddress.city'
                        }
                    ]
                },
                'presentAddress.province': {
                    $cond: [
                        {
                            $or: [
                                {
                                    $eq: [
                                        '$presentAddress.province',
                                        ''
                                    ]
                                },
                                {
                                    $eq: [
                                        '$presentAddress.province',
                                        null
                                    ]
                                }
                            ]
                        },
                        null,
                        {
                            $toObjectId: '$presentAddress.province'
                        }
                    ]
                },
                'previousAddress.barangay': {
                    $cond: [
                        {
                            $or: [
                                {
                                    $eq: [
                                        '$previousAddress.barangay',
                                        ''
                                    ]
                                },
                                {
                                    $eq: [
                                        '$previousAddress.barangay',
                                        null
                                    ]
                                }
                            ]
                        },
                        null,
                        {
                            $toObjectId: '$previousAddress.barangay'
                        }
                    ]
                },
                'previousAddress.city': {
                    $cond: [
                        {
                            $or: [
                                {
                                    $eq: [
                                        '$previousAddress.city',
                                        ''
                                    ]
                                },
                                {
                                    $eq: [
                                        '$previousAddress.city',
                                        null
                                    ]
                                }
                            ]
                        },
                        null,
                        {
                            $toObjectId: '$previousAddress.city'
                        }
                    ]
                },
                'previousAddress.province': {
                    $cond: [
                        {
                            $or: [
                                {
                                    $eq: [
                                        '$previousAddress.province',
                                        ''
                                    ]
                                },
                                {
                                    $eq: [
                                        '$previousAddress.province',
                                        null
                                    ]
                                }
                            ]
                        },
                        null,
                        {
                            $toObjectId: '$previousAddress.province'
                        }
                    ]
                }
            }
        },
        {
            $lookup: {
                from: 'locations',
                localField: 'presentAddress.barangay',
                foreignField: '_id',
                as: 'presentAddress.barangay'
            }
        },
        {
            $unwind: {
                path: '$presentAddress.barangay',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'locations',
                localField: 'presentAddress.city',
                foreignField: '_id',
                as: 'presentAddress.city'
            }
        },
        {
            $unwind: {
                path: '$presentAddress.city',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'locations',
                localField: 'presentAddress.province',
                foreignField: '_id',
                as: 'presentAddress.province'
            }
        },
        {
            $unwind: {
                path: '$presentAddress.province',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'locations',
                localField: 'previousAddress.barangay',
                foreignField: '_id',
                as: 'previousAddress.barangay'
            }
        },
        {
            $unwind: {
                path: '$previousAddress.barangay',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'locations',
                localField: 'previousAddress.city',
                foreignField: '_id',
                as: 'previousAddress.city'
            }
        },
        {
            $unwind: {
                path: '$previousAddress.city',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'locations',
                localField: 'previousAddress.province',
                foreignField: '_id',
                as: 'previousAddress.province'
            }
        },
        {
            $unwind: {
                path: '$previousAddress.province',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'branches',
                localField: 'vehiclePurchased.branch',
                foreignField: '_id',
                as: 'vehiclePurchased.branch'
            }
        },
        {
            $unwind: {
                path: '$vehiclePurchased.branch',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'vehicles',
                localField: 'vehiclePurchased.variant',
                foreignField: '_id',
                as: 'vehiclePurchased.variant'
            }
        },
        {
            $unwind: {
                path: '$vehiclePurchased.variant',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'vehicles',
                localField: 'vehiclePurchased.year',
                foreignField: '_id',
                as: 'vehiclePurchased.year'
            }
        },
        {
            $unwind: {
                path: '$vehiclePurchased.year',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'financingpartners',
                localField: 'vehiclePurchased.banks',
                foreignField: '_id',
                as: 'vehiclePurchased.financing'
            }
        },
        {
            $addFields: {
                'vehiclePurchased.banks': {
                    $map: {
                        input: '$vehiclePurchased.financing',
                        as: 'el',
                        in: '$$el.name'
                    }
                }
            }
        },
        {
            $unwind: {
                path: '$vehiclePurchased.borrowerSignature',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$vehiclePurchased.spouseSignature',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'vehiclePurchased.salesExecutive',
                foreignField: '_id',
                as: 'vehiclePurchased.salesExecutive'
            }
        },
        {
            $unwind: {
                path: '$vehiclePurchased.salesExecutive',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                applicant: {
                    firstName: '$user.firstName',
                    middleName: '$user.middleName',
                    lastName: '$user.lastName',
                    email: '$user.email',
                    mobile: '$user.mobile',
                    telephone: '$user.telephone'
                },
                'applicant.age': '$age',
                'applicant.birthday': '$birthday',
                'applicant.tin': '$tin',
                'applicant.maritalStatus': {
                    'status': '$maritalStatus',
                    'typeOfSeparation': '$typeOfSeparation'
                },
                'applicant.citizenship': '$citizenship',
                'applicant.presentAddress.name': {
                    $cond: [
                        {
                            $or: [
                                {
                                    $eq: [
                                        {
                                            $type: '$presentAddress.barangay'
                                        },
                                        'missing'
                                    ]
                                }
                            ]
                        },
                        {
                            $concat: [
                                '$presentAddress.street',
                                ' ',
                                '$presentAddress.city.name',
                                ' ',
                                '$presentAddress.province.name',
                                ' ',
                                'Philippines'
                            ]
                        },
                        {
                            $concat: [
                                '$presentAddress.street',
                                ' ',
                                'Brgy. ',
                                '$presentAddress.barangay.name',
                                ' ',
                                '$presentAddress.city.name',
                                ' ',
                                '$presentAddress.province.name',
                                ' ',
                                'Philippines'
                            ]
                        }
                    ]
                },
                'applicant.presentAddress.lengthOfStay': '$presentAddress.lengthOfStay',
                'applicant.presentAddress.ownership': '$presentAddress.ownership',
                'applicant.presentAddress.noOfDependents': '$presentAddress.noOfDependents',
                'applicant.previousAddress.name': {
                    $cond: [
                        {
                            $or: [
                                {
                                    $eq: [
                                        {
                                            $type: '$previousAddress.barangay'
                                        },
                                        'missing'
                                    ]
                                }
                            ]
                        },
                        {
                            $concat: [
                                '$previousAddress.street',
                                ' ',
                                '$previousAddress.city.name',
                                ' ',
                                '$previousAddress.province.name',
                                ' ',
                                'Philippines'
                            ]
                        },
                        {
                            $concat: [
                                '$previousAddress.street',
                                ' ',
                                'Brgy. ',
                                '$previousAddress.barangay.name',
                                ' ',
                                '$previousAddress.city.name',
                                ' ',
                                '$previousAddress.province.name',
                                ' ',
                                'Philippines'
                            ]
                        }
                    ]
                },
                'applicant.previousAddress.lengthOfStay': '$previousAddress.lengthOfStay',
                'vehiclePurchased.branch': '$vehiclePurchased.branch.name',
                'vehiclePurchased.variant': '$vehiclePurchased.variant.variant',
                'vehiclePurchased.year': '$vehiclePurchased.year.year',
                'vehiclePurchased.salesExecutive': {
                    $concat: [
                        '$vehiclePurchased.salesExecutive.firstName',
                        ' ',
                        '$vehiclePurchased.salesExecutive.lastName'
                    ]
                }
            }
        },
        {
            $project: {
                user: 0,
                age: 0,
                birthday: 0,
                tin: 0,
                maritalStatus: 0,
                citizenship: 0,
                presentAddress: 0,
                previousAddress: 0,
                'vehiclePurchased.financing': 0,
                _revision: 0
            }
        }
    ],
    invoiceRetailByMonthCompany: ({ year, type, filter }) => {
        if (type === 'Month') {
            if (filter === 'Company') {
                return company.monthlyCompany(year)
            }
            else if (filter === 'Branch') {
                return branch.monthlyBranch(year)
            }
            else if (filter === 'Brand') {
                return brand.monthlyBrand(year)
            }
        }
        return null
    }
}