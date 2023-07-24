module.exports = {
    postLocation: {
        name: 'Create Location',
        module: 'Master Data',
        route: [
            {
                name: '/location',
                method: 'post'
            }
        ]
    },
    viewLocation: {
        name: 'View Location',
        module: 'Master Data',
        route: [
            {
                name: '/location/:_id',
                method: 'get',
                params: {
                    _id: [ '*' ]
                }
            }
        ]       
    },
    viewAllLocation: {
        name: 'View All Location',
        module: 'Master Data',
        route: [
            {
                name: '/location',
                method: 'get'
            }
        ]       
    },
    patchLocation: {
        name: 'Update Location',
        module: 'Master Data',
        route: [
            {
                name: '/location/:_id',
                method: 'patch',
                params: {
                    _id: [ '*' ]
                }
            }
        ]       
    }
}