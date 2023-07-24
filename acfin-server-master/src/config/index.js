/* eslint-disable no-invalid-this */
const path = require('path')
// Need to disable rule to enable importing environmental variable values via file 
/* eslint-disable no-process-env */
require('dotenv').config()

const environment = process.env.ENVIRONMENT || 'local'

module.exports = {
    environment,
    protocol: process.env.PROTOCOL || 'http',
    domain: process.env.DOMAIN,
    port: process.env.PORT || 3001,
    swaggerPort: process.env.SWAGGER_PORT || 9001,
    dbURL: process.env.MONGO_URI,
    configDbURL: process.env.CONFIG_DB_URI,
    authURL: process.env.AUTH_DB_URI,
    __homePath: process.env.EFS_DIR,
    maxFileUploadSize: process.env.MAX_FILE_UPLOAD_SIZE || 3145728,
    smtpAuth: {
        host: process.env.SMTP_AUTH_HOST,
        port: process.env.SMTP_AUTH_PORT || 587,
        auth: {
            user: process.env.SMTP_AUTH_USER,
            pass: process.env.SMTP_AUTH_CLIENTPASS
        }
    },
    appData: {
        organization: "AC MOTORS FINANCING APPLICATION",
        acronym: "ACMOTORS",
        title: "AC Motors Online Financing",
        email: "noreply@acmotors.com.ph",
        logo: "/ACMotorsLogo.png"
    },
    pathToUse: path.resolve('src'),
    secret: process.env.APP_SECRET,
    cookieMaxAge: process.env.COOKIE_MAX_AGE,
    payloadMaxSize: '20mb',
    corsOptions: {
        origin: environment === 'local' ? [
            'http://localhost:3000',
            'http://localhost'
        ] : [
            'http://localhost:3000',
            'http://maroon-studios.wiki.maroonstudios.com/ac-motors/acfin-server/',
            'http://35.220.217.63'
        ],
        credentials: true
    },
    morganRules: {
        default: ':method :url :status :response-time ms - :res[content-length]'
    },
    canSoftDelete: true,
    filerPath: {
        main: 'adris-files',
        user: 'adris-user-files'
    },
    disableGuestAutoCreate: true
}