/* eslint-disable global-require */
/* eslint-disable no-sync */
const fs = require('fs')
const path = require('path')
const { toCamelCase } = require('js-utils').parser

const roles = {
}

const libPath = path.join(__dirname, '')
// eslint-disable-next-line security/detect-non-literal-fs-filename
fs.readdirSync(libPath).forEach((file) => {
    if (![ "index.js" ].includes(file)) {
        // eslint-disable-next-line security/detect-non-literal-require
        const role = require(`./${file}`)
        const roleName = toCamelCase({
            file 
        })
        roles[`${roleName}`] = role
    }
})

module.exports = roles