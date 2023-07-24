export const post = (url, body) => fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify(body)
})

export const patch = (url, body = {}) => fetch(url, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify(body)
})

export const postFormData = (url, body = {}) => fetch(url, {
  method: 'POST',
  credentials: 'include',
  body
})

export const patchFormData = (url, body = {}) => fetch(url, {
  method: 'PATCH',
  credentials: 'include',
  body
})

export const get = (url) => fetch(url, {
  method: 'GET',
  credentials: 'include'
})

export const remove = (url, body) => fetch(url, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify(body)
})
