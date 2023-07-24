module.exports = {
    postCompany: {
        name: 'Create Company',
        module: 'Master Data',
        route: [
            {
                name: '/company',
                method: 'post'
            },
            {
                name: '/branch',
                method: 'post'
            }
        ]
    },
    patchCompany: {
        name: 'Update Company',
        module: 'Master Data',
        route: [
            {
                name: '/company/:_id',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            },
            {
                name: '/branch/:_id',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]       
    },
    viewCompany: {
        name: 'View Company',
        module: 'Master Data',
        route: [
            {
                name: '/company/:_id',
                method: 'get',
                params: {
                    _id: [ '*' ]
                }
            },
            {
                name: '/branch/:_id',
                method: 'get',
                params: {
                    _id: [ '*' ]
                }
            }
        ]       
    },
    viewAllCompany: {
        name: 'View All Company',
        module: 'Master Data',
        route: [
            {
                name: '/company',
                method: 'get'
            },
            {
                name: '/branch',
                method: 'get'
            }
        ]       
    },
    softDeleteCompany: {
        name: 'Soft Delete Company',
        module: 'Master Data',
        route: [
            {
                name: '/company/:_id/:_operation',
                method: 'patch',
                params: {
                    _id: [ '*' ],
                    _operation: [ 'delete' ]
                }
            },
            {
                name: '/branch/:_id/:_operation',
                method: 'patch',
                params: {
                    _id: [ '*' ],
                    _operation: [ 'delete' ]
                }
            }
        ]       
    },
    deleteCompany: {
        name: 'Delete Company',
        module: 'Master Data',
        route: [
            {
                name: '/company/:_id',
                method: 'delete',
                params: {
                    _id: [ '*' ]
                }
            },
            {
                name: '/company/multiple/delete',
                method: 'post'
            },
            {
                name: '/branch/:_id',
                method: 'delete',
                params: {
                    _id: [ '*' ]
                }
            },
            {
                name: '/branch/multiple/delete',
                method: 'post'
            }
        ]       
    },
    viewCompanyAttachment: {
        name: 'View User Attachment',
        module: 'Account Administration',
        route: [
            {
                name: '/attachment/company/:_id/:_fieldName/:_fileName',
                method: 'get',
                params: {
                    _id: [ '*' ],
                    _fieldName: [ '*' ],
                    _fileName: [ '*' ]
                }
            }
        ]       
    },
    postCompanyAttachment: {
        name: 'Post User Attachment',
        module: 'Account Administration',
        route: [
            {
                name: '/attachment/company/:_id/:_fieldName',
                method: 'post',
                params: {
                    _id: [ '*' ],
                    _fieldName: [ '*' ]
                }
            }
        ]
    }
}