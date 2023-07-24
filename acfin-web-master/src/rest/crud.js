/* eslint-disable object-shorthand */
const { baseUrl, crudUrl = '' } = require('@/settings')

const call = (method) => ({
  url, body, headers = {
    'Content-Type': 'application/json'
  }
}) => fetch(url, {
  method,
  headers,
  credentials: 'include',
  body: body && JSON.stringify(body)
})
const callForm = (method) => ({
  url, body = {}
}) => fetch(url, {
  method,
  credentials: 'include',
  body
})
const encodeReqQuery = (url, query) => {
  const keys = Object.keys(query)
  return keys
    .filter((k) => query[k])
    .reduce((acc, curr, i) => curr && query[curr] ? `${acc}${curr}=${query[curr]}&` : acc
      , url + '?')
}

module.exports = (model) => ({
  url: `${baseUrl}/${crudUrl}${model}`,
  list: async function ({
    start, count, dataview, queries, search, view, extQuery, sortBy, searchKey
  } = {}) {
    let url = encodeReqQuery(this.url, { view, start, count, dataview, search, sortBy, searchKey })
    queries && (url = `${url}advancedQuery=${encodeURI(JSON.stringify(queries))}`)
    extQuery && (url = `${url}${extQuery}`)
    const resp = await call('GET')({ url })
    const data = await resp.json()
    data.ok = resp.ok
    return data
  },
  get: async function (query = {}) {
    const resp = await call('GET')({ url: encodeReqQuery(this.url, query).slice(0, -1) })
    return resp
  },
  create: async function (props) {
    const resp = await call('POST')({ url: this.url, body: props })
    return resp
  },
  exportPDF: async function (id, type) {
    const url = `${this.url}/${id}`
    const resp = await call('POST')({ url: url, body: type })
    const data = await resp.json()
    return data
  },
  createForm: async function (props, upload, id, fieldName) {
    const url = encodeReqQuery(id ? `${this.url}/${id}/${fieldName}` : this.url, upload).slice(0, -1)
    const resp = await callForm('POST')({ url, body: props })
    return resp
  },
  updateForm: async function (props, upload, id, fieldName) {
    const url = encodeReqQuery(id ? `${this.url}/${id}/${fieldName}` : this.url, upload).slice(0, -1)
    const resp = await callForm('PATCH')({ url, body: props })
    return resp
  },
  read: async function (id, dataview, populate, view) {
    const url = encodeReqQuery(id ? `${this.url}/${id}` : this.url, { dataview, populate, view })
    const resp = await call('GET')({ url })
    const data = await resp.json()
    data.ok = resp.ok
    return data
  },
  getImage: async function (id, fileName, query) {
    const url = `${this.url}/${id}/attachments/${fileName}?upload=${query}`
    const resp = await call('GET')({ url })
    const data = await resp.json()
    data.ok = resp.ok
    return data
  },
  getAttachment: async function (id, fieldName, fileName) {
    const url = `${this.url}/${id}/${fieldName}/${fileName}`
    const resp = await call('GET')({ url })
    const data = await resp.json()
    data.ok = resp.ok
    return data
  },
  update: async function (id, body) {
    const resp = await call('PATCH')({ url: id ? `${this.url}/${id}` : this.url, body })
    return resp
  },
  updateMultiple: async function (props) {
    const resp = await call('POST')({ url: `${this.url}/multiple/update`, body: props })
    return resp
  },
  delete: async function (id) {
    const resp = await call('DELETE')({ url: id ? `${this.url}/${id}` : this.url })
    return resp
  },
  deleteMultiple: async function (ids) {
    const resp = await call('POST')({ url: `${this.url}/multiple/delete`, body: { ids } })
    return resp
  },
  run: function (fn) {
    return (id) => async (args) => {
      const resp = await call('PATCH')({ url: id ? `${this.url}/${id}` : this.url, body: { fn, args } })
      const data = await resp.json()
      data.ok = resp.ok
      return data
    }
  },
  autofill: async function (autofillURL) {
    const url = `${baseUrl}${autofillURL}`
    const resp = await call('GET')({ url })
    const data = await resp.json()
    data.ok = resp.ok
    return data
  }
})
