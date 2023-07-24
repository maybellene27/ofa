/* eslint-disable no-sync */
/* eslint-disable no-console */
const fs = require('fs')
const { Authentication } = require('../../src/config/auth')
const { adminUserTemplate, guestUserTemplate } = require('../../src/config/meta')
const userModel = require('../../src/models/user')
const { getNestedValue } = require('../../src/lib/utils')
const { usernamePath } = require('../../src/config/meta')

const createGuestUser = async () => {
    const { firstName, middleName, lastName, userRole } = guestUserTemplate
    const guestUser = await userModel.create({
        ...guestUserTemplate,
        _revision: {
            author: {
                doc: null,
                userModel: userModel.constructor.modelName,
                userRole: userRole
            },
            description: `Created user named ${firstName}${middleName ? middleName : ''} ${lastName} by ${firstName}${middleName ? ` ${middleName}` : ''} ${lastName}.`
        }
    })
    await Authentication.create({
        userDocument: guestUser._id,
        collectionName: userModel.constructor.modelName,
        password: guestUserTemplate.password,
        username: getNestedValue(guestUser, usernamePath.guest),
        email: {
            value: guestUser.email,
            verified: true
        },
        userRole: 'guest',
        _revision: {
            author: {
                doc: guestUser._id,
                userModel: userModel.constructor.modelName,
                userRole: 'guest'
            },
            description: `Created credentials for ${firstName}${middleName ? middleName : ''} ${lastName} by ${firstName}${middleName ? ` ${middleName}` : ''} ${lastName}.`
        }
    })
}
const seed = async () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const files = fs.readdirSync(`${__dirname}/..`)
    if(Array.isArray(files)) {
        const filePromise = files.map(async (file) => {
            if(file.endsWith('test.js')) {
                const { firstName, middleName, lastName } = adminUserTemplate
                const adminUser = await userModel.create({
                    ...adminUserTemplate,
                    email: `${file.split('.')[0]}@mail.com`,
                    _revision: {
                        author: {
                            doc: null,
                            userModel: userModel.constructor.modelName
                        },
                        description: `Created user named ${firstName}${middleName ? middleName : ''} ${lastName} by ${firstName}${middleName ? ` ${middleName}` : ''} ${lastName}.`
                    }
                })
                const authDoc = await Authentication.create({
                    userDocument: adminUser._id,
                    collectionName: userModel.constructor.modelName,
                    password: adminUserTemplate.password,
                    username: getNestedValue(adminUser, usernamePath.guest),
                    email: {
                        value: adminUser.email,
                        verified: true
                    },
                    userType: adminUser.userType,
                    userRole: [ 'admin' ],
                    _revision: {
                        author: {
                            doc: adminUser._id,
                            userModel: userModel.constructor.modelName
                        },
                        description: `Created credentials for ${firstName}${middleName ? middleName : ''} ${lastName} by ${firstName}${middleName ? ` ${middleName}` : ''} ${lastName}.`
                    }
                })
                console.log(`Created user and credentials for email named '${adminUser.email}.'`)
                return Promise.resolve(authDoc)
            }
            return Promise.resolve(false)
        })
        await Promise.all(filePromise)
    }
    await createGuestUser()
    console.log('Created user and credentials for guest user')
    // eslint-disable-next-line no-process-exit
    process.exit(0)
}

seed()