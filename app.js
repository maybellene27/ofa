const bodyParser = require('body-parser')
const helmet = require('helmet')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const session = require('express-session')
const useragent = require('express-useragent')
const cron = require('node-cron')
const jobs = require('./jobs/applicationAging')
const appRoutes = require('./src/api')
const { routes } = require('./src/config/auth')
const baseUrl = '/webapi'
const app = express()

const { 
    dbURL,
    morganRules,
    corsOptions,
    secret,
    cookieMaxAge,
    payloadMaxSize,
    appData
} = require('./src/config')

const db = require('mongodb-plugin').createConnection({
    uri: dbURL,
    name: 'AC Motors Database'
})

const MongoStore = require('connect-mongo')(session)

const sessionConfig = {
    secret,
    resave: false,
    rolling: true,
    cookie: {
        maxAge: parseInt(cookieMaxAge, 10)
    },
    name: `${appData.title}.sid`,
    saveUninitialized: false,
    unset: 'destroy',
    store: new MongoStore({
        mongooseConnection: db,
        stringify: false
    })
}

app.use(helmet.frameguard({
    action: "sameorigin"
}))
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: [ "'self'" ],
        frameAncestors: [ "'self'" ],
        formAction: [ "'self'" ]
    }
}))
app.use(helmet.noSniff())
app.disable('x-powered-by')

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use(session(sessionConfig))

app.use(bodyParser.json({
    limit: payloadMaxSize 
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: payloadMaxSize
}))
app.use(useragent.express())

app.use(morgan(morganRules.default))
cron.schedule("0 5 * * *", () => {
    jobs.approvalAging()
    jobs.recommendAging()
    jobs.releaseAging()
})

app.use(`${baseUrl}/admin`, routes.admin(''))
app.use(`${baseUrl}/user/account`, routes.authenticate(''))
app.use(`${baseUrl}/user/password`, routes.password(''))
app.use(`${baseUrl}/user`, routes.profile(''))
app.use(`${baseUrl}/config`, routes.role(''))
app.use(`${baseUrl}`, appRoutes)

const methodOverride = require('method-override')
const { clientErrorHandler } = require("error-handler").middleware
app.use(methodOverride())
app.use(clientErrorHandler)

module.exports = app