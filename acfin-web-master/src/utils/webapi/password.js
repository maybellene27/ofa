import { baseUrl } from '@/settings'
import { get, post } from '@/utils/rest'

const password = {
  request: {
    change: (password) => post(`${baseUrl}/user/password/requestchange`, { password }),
    reset: (username) => post(`${baseUrl}/user/password/forgot`, { username })
  },
  change: (otp, password) => post(`${baseUrl}/user/password/change`, { otp, password }),
  reset: (email, otp) => {
    const q = `username=${email}&email=${email}&otp=${otp}`
    const query = encodeURI(q)
    return get(`${baseUrl}/user/password/reset?${query}`)
  },
  emailChangePassword: (username, otp, password) => post(`${baseUrl}/user/password/change`, { otp, password, username }),
  hardReset: (userRole, _id) => post(`${baseUrl}/user/password/${userRole}/${_id}/resetpassword`)
}

export default password
