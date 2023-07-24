/* eslint-disable no-invalid-this */

const isDraft = function () {
    return this.status === 'drafts'
}

module.exports = {
    street: {
        type: String,
        required: [
            !isDraft,
            'Bldg. No./ House No./Street is required.'
        ]
    },
    barangay: {
        type: String
    },
    region: {
        type: String
    },
    province: {
        type: String,
        required: [
            !isDraft,
            'Province is required.'
        ]
    },
    city: {
        type: String,
        required: [
            !isDraft,
            'City is required.'
        ]
    }
    
}