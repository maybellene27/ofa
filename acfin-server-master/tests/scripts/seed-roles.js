/* eslint-disable no-negated-condition */
/* eslint-disable no-console */
const { Authorization } = require('../../src/config/auth')
const roles = require('../../src/config/roles')

const seed = async () => {
    await Authorization.create({
        _configType: 'default',
        _revision: {
            author: {
                doc: null,
                userModel: null
            },
            description: `Created user role named default by seeding.`
        }
    })

    const rolesArr = Object.keys(roles).map(async (role) => {
        const defaultAccess = await Authorization
            .buildRouteAccess(roles[`${role}`])

        await Authorization.create({
            _configType: role,
            label: role,
            ...defaultAccess,
            _revision: {
                author: {
                    doc: null,
                    userModel: null
                },
                description: `Created user role named ${role} by seeding.`
            }
        })

        await Authorization
            .updateRoleAccess(role, 'create', {
                doc: null,
                userModel: null
            })
        return Promise.resolve()
    })
    await Promise.all(rolesArr)

    console.log('Seeding user roles done.')
    // eslint-disable-next-line no-process-exit
    process.exit(0)
}

seed()