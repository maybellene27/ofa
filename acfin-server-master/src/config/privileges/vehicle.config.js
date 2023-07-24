module.exports = {
    postVehicle: {
        name: 'Create Vehicle',
        module: 'Master Data',
        route: [
            {
                name: '/vehicle',
                method: 'post'
            },
            {
                name: '/freight',
                method: 'post'
            }
        ]
    },
    patchVehicle: {
        name: 'Update Vehicle',
        module: 'Master Data',
        route: [
            {
                name: '/vehicle/:_id',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            },
            {
                name: '/freight/:_id',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]       
    },
    viewVehicle: {
        name: 'View Vehicle',
        module: 'Master Data',
        route: [
            {
                name: '/vehicle/:_id',
                method: 'get',
                params: {
                    _id: [ '*' ]
                }
            },
            {
                name: '/freight/:_id',
                method: 'get',
                params: {
                    _id: [ '*' ]
                }
            }
        ]       
    },
    viewAllVehicle: {
        name: 'View All Vehicle',
        module: 'Master Data',
        route: [
            {
                name: '/vehicle',
                method: 'get'
            },
            {
                name: '/freight',
                method: 'get'
            }
        ]       
    },
    softDeleteVehicle: {
        name: 'Soft Delete Vehicle',
        module: 'Master Data',
        route: [
            {
                name: '/vehicle/:_id/:_operation',
                method: 'patch',
                params: {
                    _id: [ '*' ],
                    _operation: [ 'delete' ]
                }
            },
            {
                name: '/freight/:_id/:_operation',
                method: 'patch',
                params: {
                    _id: [ '*' ],
                    _operation: [ 'delete' ]
                }
            }
        ]       
    },
    deleteVehicle: {
        name: 'Delete Vehicle',
        module: 'Master Data',
        route: [
            {
                name: '/vehicle/:_id',
                method: 'delete',
                params: {
                    _id: [ '*' ]
                }
            },
            {
                name: '/vehicle/multiple/delete',
                method: 'post'
            },
            {
                name: '/freight/:_id',
                method: 'delete',
                params: {
                    _id: [ '*' ]
                }
            },
            {
                name: '/freight/multiple/delete',
                method: 'post'
            }
        ]       
    }
}