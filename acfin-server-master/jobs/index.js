/* eslint-disable security/detect-non-literal-require */
/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require('fs')
const path = require('path')
const { toCamelCase } = require('js-utils').parser

const info = {
}

const libPath = path.join(__dirname, '')
// eslint-disable-next-line no-sync
fs.readdirSync(libPath).forEach((file) => {
    if(![
        "index.js",
        "seed.js" 
    ].includes(file)) {
        // eslint-disable-next-line global-require
        const model = require(`./${file}`)
        const modelName = toCamelCase({
            file
        })
        info[`${modelName}`] = model
    }
})

module.exports = info