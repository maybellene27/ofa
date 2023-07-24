module.exports = {
    exportFinancePartnerDirectory: {
        name: 'Export Vehicle',
        module: 'Master Data',
        route: [
            {
                name: '/export/report/financingPartner',
                method: 'post'
            }
        ]
    },
    exportInvoiceRetail: {
        name: 'Export Invoice Retail',
        module: 'Account Administration',
        route: [
            {
                name: '/export/report/application',
                method: 'post'
            }
        ]
    },
    bankApplication: {
        name: 'Bank Application',
        module: 'Account Administration',
        route: [
            {
                name: '/export/report/bankApplication',
                method: 'post'
            }
        ]
    }
}