import { baseUrl } from '@/settings'
import { get, patch, post, remove, postFormData } from '@/utils/rest'

const master = {
  profile: () => get(`${baseUrl}/user/account/myprofile`),
  list: (query, dataTab) => get(`${baseUrl}/${dataTab}${query}`),
  view: (dataTab, _id) => get(`${baseUrl}/${dataTab}/${_id}?populate=true`),
  patch: (dataTab, _id, newInfo) => patch(`${baseUrl}/${dataTab}/${_id}`, newInfo),
  create: (dataTab, info) => post(`${baseUrl}/${dataTab}`, info),
  delete: (dataTab, _id) => remove(`${baseUrl}/${dataTab}/${_id}`),
  deleteMultiple: (dataTab, ids) => post(`${baseUrl}/${dataTab}/multiple/delete`, ids),
  import: (module, file) => postFormData(`${baseUrl}/${module}/manage/import`, file),
  export: (module, query) => get(`${baseUrl}/${module}/manage/export${query}`)
}

export default master
