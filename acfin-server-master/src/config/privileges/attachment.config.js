module.exports = {
    postIDFront: {
        name: 'Upload Front of ID',
        module: 'Account Administration',
        route: [
            {
                name: '/attachment/user/id/front/:_id',
                method: 'post',
                params: {
                    _id: [ '*' ]
                }
            }
        ]
    },
    viewIDFront: {
        name: 'Download Front of ID',
        module: 'Account Administration',
        route: [
            {
                name: '/attachment/user/id/front/:_id',
                method: 'get',
                params: {
                    _id: [ '*' ]
                }
            }
        ]       
    },
    postIDBack: {
        name: 'Upload Back of ID',
        module: 'Account Administration',
        route: [
            {
                name: '/attachment/user/id/back/:_id',
                method: 'post',
                params: {
                    _id: [ '*' ]
                }
            }
        ]
    },
    viewIDBack: {
        name: 'Download Back of ID',
        module: 'Account Administration',
        route: [
            {
                name: '/attachment/user/id/back/:_id',
                method: 'get',
                params: {
                    _id: [ '*' ]
                }
            }
        ]       
    },
    viewUserAttachment: {
        name: 'View User Attachment',
        module: 'Account Administration',
        route: [
            {
                name: '/attachment/user/:_id/:_fieldName/:_fileName',
                method: 'get',
                params: {
                    _id: [ '*' ],
                    _fieldName: [ '*' ],
                    _fileName: [ '*' ]
                }
            }
        ]       
    },
    postUserAttachment: {
        name: 'Post User Attachment',
        module: 'Account Administration',
        route: [
            {
                name: '/attachment/user/:_id/:_fieldName',
                method: 'post',
                params: {
                    _id: [ '*' ],
                    _fieldName: [ '*' ]
                }
            }
        ]
    }
}