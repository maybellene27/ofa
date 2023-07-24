module.exports = {
    userRoleEquivalent: {
        $addFields: {
            userRole: {
                $switch: {
                    branches: [
                        {
                            case: {
                                $in: [
                                    'salesExecutive',
                                    '$userRole' 
                                ]
                            },
                            then: 'Sales Executive'
                        },
                        {
                            case: {
                                $in: [
                                    'customer',
                                    '$userRole' 
                                ]
                            },
                            then: 'Customer'
                        },
                        {
                            case: {
                                $in: [
                                    'finance',
                                    '$userRole' 
                                ]
                            },
                            then: 'Finance'
                        },
                        {
                            case: {
                                $in: [
                                    'salesManager',
                                    '$userRole' 
                                ]
                            },
                            then: 'Sales Manager'
                        },
                        {
                            case: {
                                $in: [
                                    'bankApprover',
                                    '$userRole' 
                                ] 
                            },
                            then: 'Bank Approver'
                        },
                        {
                            case: {
                                $in: [
                                    'admin',
                                    '$userRole' 
                                ] 
                            },
                            then: 'Platform Admin'
                        },
                        {
                            case: {
                                $in: [
                                    'systemAdmin',
                                    '$userRole' 
                                ]
                            },
                            then: 'System Admin'
                        },
                        {
                            case: {
                                $in: [
                                    'superUser',
                                    '$userRole' 
                                ] 
                            },
                            then: 'Super User'
                        }
                    ],
                    default: '$userRole'
                }
            }
        }
    },
    reverseUserRoleEquivalent: {
        $addFields: {
            userRole: {
                $switch: {
                    branches: [
                        {
                            case: {
                                $in: [
                                    'Sales Executive',
                                    '$userRole' 
                                ]
                            },
                            then: 'salesExecutive'
                        },
                        {
                            case: {
                                $in: [
                                    'Customer',
                                    '$userRole' 
                                ]
                            },
                            then: 'customer'
                        },
                        {
                            case: {
                                $in: [
                                    'Finance',
                                    '$userRole' 
                                ]
                            },
                            then: 'finance'
                        },
                        {
                            case: {
                                $in: [
                                    'Sales Manager',
                                    '$userRole' 
                                ]
                            },
                            then: 'salesManager'
                        },
                        {
                            case: {
                                $in: [
                                    'Bank Approver',
                                    '$userRole' 
                                ] 
                            },
                            then: 'bankApprover'
                        },
                        {
                            case: {
                                $in: [
                                    'Platform Admin',
                                    '$userRole' 
                                ] 
                            },
                            then: 'admin'
                        },
                        {
                            case: {
                                $in: [
                                    'System Admin',
                                    '$userRole' 
                                ] 
                            },
                            then: 'systemAdmin'
                        },
                        {
                            case: {
                                $in: [
                                    'Super User',
                                    '$userRole' 
                                ] 
                            },
                            then: 'superUser'
                        }
                    ],
                    default: '$userRole'
                }
            }
        }
    }
}