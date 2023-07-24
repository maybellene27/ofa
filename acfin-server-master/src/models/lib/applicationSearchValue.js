module.exports = {
    statusEquivalent: {
        $addFields: {
            status: {
                $switch: {
                    branches: [
                        {
                            case: {
                                $eq: [
                                    '$status',
                                    'approved' 
                                ] 
                            },
                            then: 'Approved and Released'
                        },
                        {
                            case: {
                                $eq: [
                                    '$status',
                                    'unreleased' 
                                ] 
                            },
                            then: 'Approved and Unreleased'
                        },
                        {
                            case: {
                                $eq: [
                                    '$status',
                                    'recommended' 
                                ] 
                            },
                            then: 'Recommended for submission to banks'
                        },
                        {
                            case: {
                                $eq: [
                                    '$status',
                                    'returned' 
                                ] 
                            },
                            then: 'Pending Document'
                        },
                        {
                            case: {
                                $eq: [
                                    '$status',
                                    'cancelled' 
                                ] 
                            },
                            then: 'Cancelled Approval'
                        },
                        {
                            case: {
                                $eq: [
                                    '$status',
                                    'recommendExpired' 
                                ] 
                            },
                            then: 'Recommend Expired'
                        }
                    ],
                    default: '$status'
                }
            }
        }
    },
    reverseStatusEquivalent: {
        $addFields: {
            status: {
                $switch: {
                    branches: [
                        {
                            case: {
                                $eq: [
                                    '$status',
                                    'Approved and Released' 
                                ] 
                            },
                            then: 'approved'
                        },
                        {
                            case: {
                                $eq: [
                                    '$status',
                                    'Approved and Unreleased' 
                                ] 
                            },
                            then: 'unreleased'
                        },
                        {
                            case: {
                                $eq: [
                                    '$status',
                                    'Recommended for submission to banks' 
                                ] 
                            },
                            then: 'recommended'
                        },
                        {
                            case: {
                                $eq: [
                                    '$status',
                                    'Pending Document' 
                                ] 
                            },
                            then: 'returned'
                        },
                        {
                            case: {
                                $eq: [
                                    '$status',
                                    'Cancelled Approval' 
                                ] 
                            },
                            then: 'cancelled'
                        },
                        {
                            case: {
                                $eq: [
                                    '$status',
                                    'Recommend Expired' 
                                ] 
                            },
                            then: 'recommendExpired'
                        }
                    ],
                    default: '$status'
                }
            }
        }
    }
}