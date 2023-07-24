module.exports = {
    postFinancingPartner: {
        name: 'Create Financing Partner',
        module: 'Master Data',
        route: [
            {
                name: '/financingPartner',
                method: 'post'
            }
        ]
    },
    patchFinancingPartner: {
        name: 'Update Financing Partner',
        module: 'Master Data',
        route: [
            {
                name: '/financingPartner/:_id',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]       
    },
    viewFinancingPartner: {
        name: 'View Financing Partner',
        module: 'Master Data',
        route: [
            {
                name: '/financingPartner/:_id',
                method: 'get',
                params: {
                    _id: [ '*' ]
                }
            }
        ]       
    },
    viewAllFinancingPartner: {
        name: 'View All Financing Partner',
        module: 'Master Data',
        route: [
            {
                name: '/financingPartner',
                method: 'get'
            }
        ]       
    },
    softDeleteFinancingPartner: {
        name: 'Soft Delete Financing Partner',
        module: 'Master Data',
        route: [
            {
                name: '/financingPartner/:_id/:_operation',
                method: 'patch',
                params: {
                    _id: [ '*' ],
                    _operation: [ 'delete' ]
                }
            }
        ]       
    },
    deleteFinancingPartner: {
        name: 'Delete Financing Partner',
        module: 'Master Data',
        route: [
            {
                name: '/financingPartner/:_id',
                method: 'delete',
                params: {
                    _id: [ '*' ]
                }
            },
            {
                name: '/financingPartner/multiple/delete',
                method: 'post'
            }
        ]       
    }
}