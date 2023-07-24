const express = require('express')

// Need to disable above rule to allow use of express.Router() which is a class
// eslint-disable-next-line new-cap
const router = express.Router()

require('./application')(router, '')
require('./smoketest')(router, '')
require('./crud')(router, '')
require('./attachment')(router, '')
require('./userProfile')(router, '')
require('./export')(router, '')

module.exports = router