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
                'Returned application requires - COE with compensation details issued not more than 1 month + authorization letter to verify.'
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
    itr: {
        required: {
            type: Boolean,
            default: false
        },
        attachment: {
            type: attachment,
            required: [
                false,
                'Returned application requires - Copy of Latest Income Tax Return (Form 2316).'
            ]
        }
    }
}