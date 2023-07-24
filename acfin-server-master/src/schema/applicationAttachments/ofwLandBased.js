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
                'Returned application requires - Latest Contract / COE with compensation details.'
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
    remittance: {
        required: {
            type: Boolean,
            default: false
        },
        attachment: {
            type: attachment,
            required: [
                false,
                'Returned application requires - Proof of remittance and Latest 3 months bank statement of remittance account + Authorization letter to verify.'
            ]
        }
    }
}