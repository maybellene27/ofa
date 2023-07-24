/* eslint-disable require-unicode-regexp */
module.exports = {
    brands: [
        'Honda',
        'Isuzu',
        'KIA',
        'KTM',
        'Maxus',
        'Volkswagen'
    ],
    userType: {
        external: 'External',
        internal: 'Internal'
    },
    capitalize: (str) => (str.charAt(0).toUpperCase() + str.slice(1)).replace(/\s+/g, " ").trim()
}