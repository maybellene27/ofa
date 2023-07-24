module.exports = {
  post: (url, body) => fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }),
  patch: (url, body = {}) => fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(body)
  }),
  get: (url) => fetch(url, {
    method: 'GET',
    credentials: 'include'
  }),
  remove: (url, body) => fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(body)
  })
}
