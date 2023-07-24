import { baseUrl } from '@/settings'
import { get, patch, post, remove } from '@/utils/rest'

const users = {
  allUsers: (query) => get(`${baseUrl}/admin/users/${query}`),
  userList: (query, userRole) => get(`${baseUrl}/admin/users/${userRole}${query}`),
  removeUser: (_id, userRole, action, info) => patch(`${baseUrl}/admin/user/${userRole}/${_id}/${action}`, info),
  getUser: (userRole, _id) => get(`${baseUrl}/admin/user/${userRole}/${_id}`),
  createUser: (info) => post(`${baseUrl}/admin/users/`, { info }),
  patchUser: (userRole, _id, info) => patch(`${baseUrl}/admin/user/${userRole}/${_id}`, { info }),
  resetPassword: (username) => post(`${baseUrl}/user/password/requestreset`, { username }),
  profile: () => get(`${baseUrl}/user/myprofile`),
  updateProfile: (newInfo) => patch(`${baseUrl}/user/myprofile`, { info: newInfo }),
  roles: {
    get: (query) => get(`${baseUrl}/config/roleaccess${query}`),
    view: (userRole) => get(`${baseUrl}/config/roleaccess/${userRole}`),
    create: (info) => post(`${baseUrl}/config/roleaccess`, info),
    update: (roleName, info) => patch(`${baseUrl}/config/roleaccess/${roleName}`, info),
    delete: (roleName) => remove(`${baseUrl}/config/roleaccess/${roleName}`),
    viewSummary: (module) => get(`${baseUrl}/config/roleaccess/summary${module ? `?module=${module}` : ''}`)
  },
  verifyEmail: (query) => get(`${baseUrl}/user/account/verify/email${query}`)
}

export default users
