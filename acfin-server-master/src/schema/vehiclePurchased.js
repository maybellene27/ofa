/* eslint-disable no-invalid-this */
const attachment = require('./attachment')
const { brands } = require('../models/lib/meta')
const local = require('./applicationAttachments/local')
const ofwLandBased = require('./applicationAttachments/ofwLandBased')
const ofwSeaBased = require('./applicationAttachments/ofwSeaBased')
const isDraft = function () {
    return this.status === 'draft'
}
module.exports = {
    branch: {
        type: 'ObjectId',
        ref: 'Branch',
        required: [
            !isDraft,
            'Branch is required.'
        ]
    },
    bodyConversion: {
        type: String
    },
    brand: {
        type: {
            String
        },
        enum: brands,
        required: [
            !isDraft,
            'Brand is required.'
        ]
    },
    model: {
        type: String,
        required: [
            !isDraft,
            'Model is required.'
        ]
    },
    variant: {
        type: "ObjectId",
        ref: "Vehicle",
        required: [
            !isDraft,
            'Unit is required.'
        ]
    },
    year: {
        type: "ObjectId",
        ref: "Vehicle",
        required: [
            !isDraft,
            'Year is required'
        ]
    },
    sellingPrice: {
        type: String,
        required: [
            !isDraft,
            'Selling Price is required.'
        ]
    },
    amountFinance: {
        type: String,
        required: [
            !isDraft,
            'Amount Finance is required.'
        ]
    },
    downpayment: {
        type: String,
        required: [
            !isDraft,
            'Downpayment is required.'
        ]
    },
    term: {
        type: String,
        enum: [
            '12',
            '18',
            '24',
            '36',
            '48',
            '60'
        ]
    },
    salesExecutive: {
        type: "ObjectId",
        ref: 'User',
        required: [
            !isDraft,
            'Downpayment is required.'
        ]
    },
    validID: {
        type: attachment
    },
    type: {
        type: String,
        enum: [
            'Local Based',
            'OFW Land Based',
            'OFW Sea Based'
        ],
        default: 'Local Based'
    },
    local,
    ofwLandBased,
    ofwSeaBased,
    banks: {
        type: [ 'ObjectId' ],
        ref: 'FinancingPartner',
        required: [
            !isDraft,
            'Bank(s) is required'
        ]
    },
    borrowerSignature: {
        type: attachment
    },
    spouseSignature: {
        type: attachment
    },
    date: {
        type: String,
        required: [
            !isDraft,
            'Date is required'
        ]
    }
}