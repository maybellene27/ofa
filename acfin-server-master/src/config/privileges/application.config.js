module.exports = {
    postApplication: {
        name: 'Create Application',
        module: 'Account Administration',
        route: [
            {
                name: '/application',
                method: 'post'
            },
            {
                name: '/application/status/:_id/submitSendMail',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]
    },
    patchApplication: {
        name: 'Update Application',
        module: 'Account Administration',
        route: [
            {
                name: '/application/:_id',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            },
            {
                name: '/application/status/:_id/submitSendMail',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]       
    },
    viewApplication: {
        name: 'View Application',
        module: 'Account Administration',
        route: [
            {
                name: '/application/:_id',
                method: 'get',
                params: {
                    _id: [ '*' ]
                }
            }
        ]       
    },
    viewAllApplication: {
        name: 'View All Application',
        module: 'Account Administration',
        route: [
            {
                name: '/application',
                method: 'get'
            }
        ]       
    },
    softDeleteApplication: {
        name: 'Soft Delete Application',
        module: 'Account Administration',
        route: [
            {
                name: '/application/:_id/:_operation',
                method: 'patch',
                params: {
                    _id: [ '*' ],
                    _operation: [ 'delete' ]
                }
            }
        ]       
    },
    deleteApplication: {
        name: 'Delete Application',
        module: 'Account Administration',
        route: [
            {
                name: '/application/:_id',
                method: 'delete',
                params: {
                    _id: [ '*' ]
                }
            },
            {
                name: '/application/multiple/delete',
                method: 'post'
            }
        ]       
    },
    viewApplicationAttachment: {
        name: 'View User Attachment',
        module: 'Account Administration',
        route: [
            {
                name: '/attachment/application/:_id/:_fieldName/:_fileName',
                method: 'get',
                params: {
                    _id: [ '*' ],
                    _fieldName: [ '*' ],
                    _fileName: [ '*' ]
                }
            }
        ]       
    },
    postApplicationAttachment: {
        name: 'Post User Attachment',
        module: 'Account Administration',
        route: [
            {
                name: '/attachment/application/:_id/:_fieldName',
                method: 'post',
                params: {
                    _id: [ '*' ],
                    _fieldName: [ '*' ]
                }
            }
        ]
    },
    recommendApplication: {
        name: 'Recommend Application',
        module: 'Account Administration',
        route: [
            {
                name: '/application/status/:_id/recommend',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            },
            {
                name: '/application/status/:_id/deleteRecommend',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            },
            {
                name: '/application/status/:_id/recommendSendMail',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]
    },
    returnApplication: {
        name: 'Return Application',
        module: 'Account Administration',
        route: [
            {
                name: '/application/status/:_id/return',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]
    },
    approveApplication: {
        name: 'Approve Application',
        module: 'Account Administration',
        route: [
            {
                name: '/application/status/:_id/approve',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]
    },
    cancelApplication: {
        name: 'Cancel Application',
        module: 'Account Administration',
        route: [
            {
                name: '/application/status/:_id/cancel',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]
    },
    unreleasedApplication: {
        name: 'Unreleased Application',
        module: 'Account Administration',
        route: [
            {
                name: '/application/status/:_id/unreleased',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]
    },
    transferApproval: {
        name: 'Transfer Approval Application',
        module: 'Account Administration',
        route: [
            {
                name: '/application/status/:_id/transfer',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]
    },
    rejectApplication: {
        name: 'Reject Application',
        module: 'Account Administration',
        route: [
            {
                name: '/application/status/:_id/reject',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]
    },
    approveBankApplication: {
        name: 'Approve Bank Application',
        module: 'Account Administration',
        route: [
            {
                name: '/bankApplication/status/:_id/approve',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]
    },
    rejectBankApplication: {
        name: 'Reject Bank Application',
        module: 'Account Administration',
        route: [
            {
                name: '/bankApplication/status/:_id/reject',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]
    },
    returnBankApplication: {
        name: 'Return Bank Application',
        module: 'Account Administration',
        route: [
            {
                name: '/bankApplication/status/:_id/return',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]
    },
    submitBankApplication: {
        name: 'Approve Bank Application',
        module: 'Account Administration',
        route: [
            {
                name: '/bankApplication/status/:_id/submit',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            },
            {
                name: '/application/status/:_id/submitSendMail',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]
    },
    postBankApplication: {
        name: 'Create Bank Application',
        module: 'Account Administration',
        route: [
            {
                name: '/bankApplication',
                method: 'post'
            },
            {
                name: '/application/status/:_id/submitSendMail',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]
    },
    patchBankApplication: {
        name: 'Update Bank Application',
        module: 'Account Administration',
        route: [
            {
                name: '/bankApplication/:_id',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            },
            {
                name: '/application/status/:_id/submitSendMail',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]       
    },
    viewBankApplicationAttachment: {
        name: 'View Bank Application Attachment',
        module: 'Account Administration',
        route: [
            {
                name: '/attachment/bankApplication/:_id/:_fieldName/:_fileName',
                method: 'get',
                params: {
                    _id: [ '*' ],
                    _fieldName: [ '*' ],
                    _fileName: [ '*' ]
                }
            }
        ]       
    },
    postBankApplicationAttachment: {
        name: 'Post Bank Application Attachment',
        module: 'Account Administration',
        route: [
            {
                name: '/attachment/bankApplication/:_id/:_fieldName',
                method: 'post',
                params: {
                    _id: [ '*' ],
                    _fieldName: [ '*' ]
                }
            }
        ]
    },
    viewBankApplication: {
        name: 'View Bank Application',
        module: 'Account Administration',
        route: [
            {
                name: '/bankApplication/:_id',
                method: 'get',
                params: {
                    _id: [ '*' ]
                }
            }
        ]       
    },
    viewAllBankApplication: {
        name: 'View All Bank Application',
        module: 'Account Administration',
        route: [
            {
                name: '/bankApplication',
                method: 'get'
            }
        ]       
    },
    applicationPreview: {
        name: 'Create Export Application',
        module: 'Export Application',
        route: [
            {
                name: '/export/application/:_id',
                method: 'post',
                params: {
                    _id: [ '*' ],
                    model: [ 'application' ]
                }
            },
            {
                name: '/export/bankApplication/:_id',
                method: 'post',
                params: {
                    _id: [ '*' ],
                    model: [ 'bankApplication' ]
                }
            }
        ]
    },
    sendMail: {
        name: 'Send Mail',
        module: 'Account Administration',
        route: [
            {
                name: '/application/status/:_id/sendmail',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]
    }
}