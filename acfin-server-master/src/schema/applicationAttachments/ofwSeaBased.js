/* eslint-disable no-invalid-this */
const attachment = require('../attachment')

module.exports = {
    coe: {
        required: {
            type: Boolean,
            default: false
        },
        attachment: {
            type: attachment,
            required: [
                false,
                'Returned application requires - Latest Contract / COE with compensation details + Authorization letter to verify.'
            ]
        }
    },
    payslip: {
        required: {
            type: Boolean,
            default: false
        },
        attachment: {
            type: attachment,
            required: [
                false,
                'Returned application requires - Copy of Latest 3 months Payslips.'
            ]
        }
    },
    allotment: {
        required: {
            type: Boolean,
            default: false
        },
        attachment: {
            type: attachment,
            required: [
                false,
                'Returned application requires - Proof of allotment and bank statement of remittance account + Authorization letter to verify.'
            ]
        }
    },
    tip: {
        required: {
            type: Boolean,
            default: false
        },
        attachment: {
            type: attachment,
            required: [
                false,
                'Returned application requires - Tipping Position (ex: F&B and Hotel Operation).'
            ]
        }
    },
    voucher: {
        required: {
            type: Boolean,
            default: false
        },
        attachment: {
            type: attachment,
            required: [
                false,
                'Returned application requires - Voucher or three (3) months latest bank statements reflecting commission/Tipping income.'
            ]
        }
    }
}