const request = require('supertest')
const app = require('../app')
const router = request.agent(app)

let updateTestUserId = ''
let updateTestUserRole = ''
let deleteTestUserId = ''
let deleteTestUserRole = ''

beforeAll(async (done) => {
    await router
        .get('/webapi/user/account/logout')
    await router
        .post('/webapi/user/account/login?forceful=true')
        .send({ 
            username: 'user@mail.com',
            password: 'maroon12345'
        })
    done()
})

afterAll(async (done) => {
    const session = await router
        .post('/webapi/user/account/session')
    if(session.body.message === 'User session has been updated.') {
        await router
            .get('/webapi/user/account/logout')
    }
    done()
})

describe('Create internal user', () => {
    it('with "admin" user role', async (done) => {
        const res = await router
            .post('/webapi/admin/users')
            .send({
                info: {
                    firstName: 'John',
                    middleName: 'Test',
                    lastName: 'One',
                    suffix: '',
                    contactNo: '1234567890',
                    email: 'johntestone@mail.com',
                    userType: 'Internal',
                    userRole: [ 'admin' ]
                }
            })
        expect(res.statusCode).toEqual(201)
        expect(res.body.message).toEqual('User has been created.')

        const { _id, userRole } = res.body.userData
        const ver = await router
            .get(`/webapi/admin/user/${userRole}/${_id}`)
        expect(ver.body.entry._id).toEqual(_id)
        expect(ver.body.entry.userRole).toEqual(userRole[0])
        done()
    }, 50000)
})

describe('Update internal user details', () => {
    beforeAll(async (done) => {
        const newUser = await router
            .post('/webapi/admin/users')
            .send({
                info: {
                    firstName: 'John',
                    middleName: 'Test',
                    lastName: 'Two',
                    suffix: '',
                    contactNo: '1234567890',
                    email: 'johntesttwo@mail.com',
                    userType: 'Internal',
                    userRole: [ 'admin' ]
                }
            })
        
        updateTestUserId = newUser.body.userData._id
        updateTestUserRole = newUser.body.userData.userRole

        done()
    })

    afterAll(async (done) => {
        await router
            .delete(`/webapi/admin/user/${updateTestUserRole}/${updateTestUserId}`)
        done()
    })

    it('with "admin" user role', async (done) => {
        const res = await router
            .patch(`/webapi/admin/user/${updateTestUserRole}/${updateTestUserId}`)
            .send({
                info: {
                    firstName: 'Updated',
                    middleName: 'Updated',
                    lastName: 'Updated'
                }
            })

        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toEqual('User has been updated.')

        const { firstName, middleName, lastName, email } = res.body.userData

        const ver = await router
            .get(`/webapi/admin/user/${updateTestUserRole}/${updateTestUserId}`)
        expect(ver.body.entry._id).toEqual(updateTestUserId)
        expect(ver.body.entry.firstName).toEqual(firstName)
        expect(ver.body.entry.middleName).toEqual(middleName)
        expect(ver.body.entry.lastName).toEqual(lastName)
        expect(ver.body.entry.email).toEqual(email)
        done()
    }, 50000)
})

describe('Delete internal user', () => {
    beforeAll(async (done) => {
        const newUser = await router
            .post('/webapi/admin/users')
            .send({
                info: {
                    firstName: 'John',
                    middleName: 'Test',
                    lastName: 'Three',
                    suffix: '',
                    contactNo: '1234567890',
                    email: 'johntestthree@mail.com',
                    userType: 'Internal',
                    userRole: [ 'admin' ]
                }
            })
        
        deleteTestUserId = newUser.body.userData._id
        deleteTestUserRole = newUser.body.userData.userRole

        done()
    })

    afterAll(async (done) => {
        await router
            .delete(`/webapi/admin/user/${deleteTestUserRole}/${deleteTestUserId}`)
        done()
    })

    it('Delete a user from the system', async (done) => {
        const users = await router
            .get('/webapi/admin/users')

        const preDeleteTotalUsers = users.body.total

        const res = await router
            .delete(`/webapi/admin/user/${deleteTestUserRole}/${deleteTestUserId}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toEqual('User has been deleted.')

        const ver = await router
            .get(`/webapi/admin/user/${deleteTestUserRole}/${deleteTestUserId}`)
        expect(ver.body.error).toEqual('User is not found.')

        const ver2 = await router
            .get('/webapi/admin/users')
        
        expect(ver2.body.total).toEqual(preDeleteTotalUsers - 1)
        done()
    }, 50000)
})