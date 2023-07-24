
const parseTimePartString = ({
    fieldName,
    padded = false,
    isHour = false
}) => {
    const padPipeline = padded ? {
        $concat: [
            '0',
            {
                $toString: `$${fieldName}`
            }
        ]
    } : {
        $toString: `$${fieldName}`
    }

    return isHour ? {
        $cond: [    
            {
                $gte: [
                    {
                        $toInt: `$${fieldName}` 
                    },
                    10
                ] 
            },
            {
                $concat: [
                    {
                        $toString: `$${fieldName}`
                    }
                ]
            },
            {
                $cond: [
                    {
                        $eq: [
                            {
                                $toInt: `$${fieldName}`
                            },
                            0
                        ]
                    },
                    '12',
                    padPipeline
                ]
            }
        ]
    } : {
        $cond: [
            {
                $gte: [
                    {
                        $toInt: `$${fieldName}` 
                    },
                    10
                ] 
            },
            {
                $concat: [
                    {
                        $toString: `$${fieldName}`
                    }
                ]
            },
            padPipeline
        ]
    }
}

module.exports = (settings) => ({
    to12HourString: ({
        fieldName,
        timezone = 'Asia/Manila'
    }) => [
        {
            $addFields: {
                [`${fieldName}ToParts`]: {
                    $dateToParts: {
                        date: `$${fieldName}`,
                        timezone
                    }
                }
            }
        },
        {
            $addFields: {
                [`${fieldName}ToParts.period`]: {
                    $cond: [
                        {
                            $lt: [
                                {
                                    $toInt: `$${fieldName}ToParts.hour`
                                },
                                12
                            ] 
                        },
                        'AM',
                        'PM'
                    ]
                },
                [`${fieldName}ToParts.hour`]: {
                    $mod: [
                        `$${fieldName}ToParts.hour`,
                        12
                    ]
                }
            }
        },
        {
            $addFields: {
                [`${fieldName}`]: {
                    $concat: [
                        parseTimePartString({
                            fieldName: `${fieldName}ToParts.month`,
                            padded: settings.padDates
                        }),
                        '/',
                        parseTimePartString({
                            fieldName: `${fieldName}ToParts.day`,
                            padded: settings.padDates
                        }),
                        '/',
                        parseTimePartString({
                            fieldName: `${fieldName}ToParts.year`
                        }),
                        ' ',
                        parseTimePartString({
                            fieldName: `${fieldName}ToParts.hour`,
                            padded: settings.padTimes,
                            isHour: true
                        }),
                        ':',
                        parseTimePartString({
                            fieldName: `${fieldName}ToParts.minute`,
                            padded: true
                        }),
                        ":",
                        parseTimePartString({
                            fieldName: `${fieldName}ToParts.second`,
                            padded: true
                        }),
                        ' ',
                        `$${fieldName}ToParts.period`
                    ]
                }
            }
        },
        {
            $project: {
                [`${fieldName}ToParts`]: 0
            }
        }
    ],
    toDateFormat: ({
        fieldName,
        timezone = 'Asia/Manila'
    }) => [
        {
            $addFields: {
                [`${fieldName}ToParts`]: {
                    $dateToParts: {
                        date: `$${fieldName}`,
                        timezone
                    }
                }
            }
        },
        {
            $addFields: {
                [`${fieldName}`]: {
                    $concat: [
                        parseTimePartString({
                            fieldName: `${fieldName}ToParts.month`,
                            padded: settings.padDates
                        }),
                        '/',
                        parseTimePartString({
                            fieldName: `${fieldName}ToParts.day`,
                            padded: settings.padDates
                        }),
                        '/',
                        parseTimePartString({
                            fieldName: `${fieldName}ToParts.year`
                        })
                    ]
                }
            }
        },
        {
            $project: {
                [`${fieldName}ToParts`]: 0
            }
        }
    ]
})