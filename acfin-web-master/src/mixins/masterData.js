import { baseUrl } from '@/settings'
import { get, patch } from '@/utils/rest'

export default {
  get: async (collection, advancedQuery, users = false) => {
    if (users) return await get(`${baseUrl}/admin/users/user${advancedQuery}`)
    return await get(`${baseUrl}/${collection}${advancedQuery}`)
  },
  roles: async (query) => get(`${baseUrl}/config/roleaccess${query}`),
  campus: async () => get(`${baseUrl}/campus`),
  professor: (query) => get(`${baseUrl}/admin/users/user${query}`),
  section: async (query) => get(`${baseUrl}/section${query}`),
  division: async () => get(`${baseUrl}/division`),
  campusDivision: async (query) => get(`${baseUrl}/division${query}`),
  preRequisites: async (query) => get(`${baseUrl}/subject${query}`),
  userList: (query) => get(`${baseUrl}/admin/users${query}`),
  subject: async (query) => get(`${baseUrl}/subject${query}`),
  room: async (query) => get(`${baseUrl}/classroom${query}`),
  addElective: async (info) => patch(`${baseUrl}/schedule/manage/add`, info)
}
