const formatFieldName = (fieldName) => {
    let formattedFieldName = ''
    if(fieldName.includes('fullName')) {
        formattedFieldName = fieldName.slice(0, fieldName.lastIndexOf('.') + 1)
    }
    else {
        formattedFieldName = `${formatFieldName}.`
    }
    return formattedFieldName
}

module.exports = {
    createdBy: {
        $concat: [
            {
                $ifNull: [
                    '$createdBy.salutation',
                    ''
                ]
            },
            {
                $cond: [
                    {
                        $and: [
                            {
                                $ifNull: [
                                    '$createdBy.salutation',
                                    false 
                                ] 
                            },
                            {
                                $ne: [
                                    '$createdBy.salutation',
                                    '' 
                                ] 
                            }
                        ]
                    },
                    ' ',
                    ''
                ]
            },
            '$createdBy.firstName',
            ' ',
            '$createdBy.middleName',
            {
                $cond: [
                    {
                        $eq: [
                            '$createdBy.middleName',
                            ''
                        ]
                    },
                    '',
                    ' '
                ]
            },
            '$createdBy.lastName',
            {
                $cond: [
                    {
                        $eq: [
                            '$createdBy.suffix',
                            ''
                        ]
                    },
                    '',
                    ' '
                ]
            },
            '$createdBy.suffix'
        ]
    },
    updatedBy: {
        $concat: [
            {
                $ifNull: [
                    '$updatedBy.salutation',
                    ''
                ]
            },
            {
                $cond: [
                    {
                        $and: [
                            {
                                $ifNull: [
                                    '$updatedBy.salutation',
                                    false 
                                ] 
                            },
                            {
                                $ne: [
                                    '$updatedBy.salutation',
                                    '' 
                                ] 
                            }
                        ]
                    },
                    ' ',
                    ''
                ]
            },
            '$updatedBy.firstName',
            ' ',
            '$updatedBy.middleName',
            {
                $cond: [
                    {
                        $eq: [
                            '$updatedBy.middleName',
                            ''
                        ]
                    },
                    '',
                    ' '
                ]
            },
            '$updatedBy.lastName',
            {
                $cond: [
                    {
                        $eq: [
                            '$updatedBy.suffix',
                            ''
                        ]
                    },
                    '',
                    ' '
                ]
            },
            '$updatedBy.suffix'
        ]
    },
    createdByAndUpdatedByLookup: [
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'updatedBy',
                foreignField: '_id',
                as: 'updatedBy'
            }
        },
        {
            $unwind: {
                path: '$createdBy',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$updatedBy',
                preserveNullAndEmptyArrays: true
            }
        }
    ],
    locationLookup: [
        {
            $lookup: {
                from: 'locations',
                localField: 'region',
                foreignField: '_id',
                as: 'region'
            }
        },
        {
            $lookup: {
                from: 'locations',
                localField: 'province',
                foreignField: '_id',
                as: 'province'
            }
        },
        {
            $lookup: {
                from: 'locations',
                localField: 'cityOrMunicipality',
                foreignField: '_id',
                as: 'cityOrMunicipality'
            }
        },
        {
            $lookup: {
                from: 'locations',
                localField: 'barangay',
                foreignField: '_id',
                as: 'barangay'
            }
        },
        {
            $unwind: {
                path: '$region',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$province',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$cityOrMunicipality',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$barangay',
                preserveNullAndEmptyArrays: true
            }
        }
    ],
    fullNameAggregation: (fieldName) => ({
        $concat: [
            {
                $ifNull: [
                    `$${formatFieldName(fieldName)}.salutation`,
                    ''
                ]
            },
            {
                $cond: [
                    {
                        $and: [
                            {
                                $ifNull: [
                                    `$${formatFieldName(fieldName)}.salutation`,
                                    false 
                                ] 
                            },
                            {
                                $ne: [
                                    `$${formatFieldName(fieldName)}.salutation`,
                                    '' 
                                ] 
                            }
                        ]
                    },
                    ' ',
                    ''
                ]
            },
            `$${formatFieldName(fieldName)}.firstName`,
            ' ',
            `$${formatFieldName(fieldName)}.middleName`,
            {
                $cond: [
                    {
                        $eq: [
                            `$${formatFieldName(fieldName)}.middleName`,
                            ''
                        ]
                    },
                    '',
                    ' '
                ]
            },
            `$${formatFieldName(fieldName)}.lastName`,
            {
                $cond: [
                    {
                        $eq: [
                            `$${formatFieldName(fieldName)}.suffix`,
                            ''
                        ]
                    },
                    '',
                    ' '
                ]
            },
            `$${formatFieldName(fieldName)}.suffix`
        ]
    })
}