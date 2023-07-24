/* eslint-disable global-require */
/* eslint-disable no-sync */
const fs = require('fs')
const path = require('path')

let modules = {
}

const libPath = path.join(__dirname, '')
// eslint-disable-next-line security/detect-non-literal-fs-filename
fs.readdirSync(libPath).forEach((file) => {
    if (![ "index.js" ].includes(file)) {
        // eslint-disable-next-line security/detect-non-literal-require
        const moduleSet = require(`./${file}`)
        modules = {
            ...modules,
            ...moduleSet
        }
    }
})

module.exports = modules