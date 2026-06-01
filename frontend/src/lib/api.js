const BASE_URL = ''

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = localStorage.getItem('token')
  if (token) headers.Authorization = `Token ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(data.error || data.detail || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return data
}

export const api = {
  login: (username, password) =>
    request('/api/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  register: (data) =>
    request('/api/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getClient: () => request('/api/client/'),

  updateClient: (data) =>
    request('/api/client/', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}