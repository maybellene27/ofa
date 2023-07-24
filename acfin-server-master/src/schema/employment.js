/* eslint-disable no-invalid-this */

const isDraft = function () {
    return this.status === 'drafts'
}

module.exports = (isRequired) => ({
    type: {
        type: String,
        enum: [
            'Employment',
            'Business'
        ],
        required: [
            !isDraft && isRequired,
            'Employment/Business Name is required.'
        ]
    },
    name: {
        type: String,
        required: [
            !isDraft && isRequired,
            'Employment/Business Name is required.'
        ]
    },
    address: {
        type: String,
        required: [
            !isDraft && isRequired,
            'Position is required.'
        ]
    },
    position: {
        type: String,
        required: [
            !isDraft && isRequired,
            'Position is required.'
        ]
    },
    telephone: {
        type: String
    },
    years: {
        type: String,
        required: [
            !isDraft && isRequired,
            'Years is required.'
        ]
    },
    monthlyIncome: {
        type: String,
        required: [
            !isDraft && isRequired,
            'Years is required.'
        ]
    },
    otherSourceOfIncome: {
        type: String
    }
})