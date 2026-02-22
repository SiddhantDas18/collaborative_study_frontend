const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333'

async function request(path, options = {}, userId) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (userId) {
    headers['x-user-id'] = userId
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(errorData.message || 'Request failed')
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const apiClient = {
  apiBaseUrl: API_BASE_URL,
  oauthLogin: (payload) =>
    request('/auth/oauth-login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  me: (userId) => request('/me', {}, userId),
  listGroups: (userId) => request('/groups', {}, userId),
  createGroup: (name, userId) =>
    request(
      '/groups',
      {
        method: 'POST',
        body: JSON.stringify({ name }),
      },
      userId
    ),
  joinGroup: (groupId, userId) =>
    request(
      `/groups/${groupId}/join`,
      {
        method: 'POST',
      },
      userId
    ),
  listSessions: (groupId, userId) => request(`/groups/${groupId}/sessions`, {}, userId),
  createSession: (groupId, payload, userId) =>
    request(
      `/groups/${groupId}/sessions`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      userId
    ),
  updateSession: (sessionId, payload, userId) =>
    request(
      `/sessions/${sessionId}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
      userId
    ),
  deleteSession: (sessionId, userId) =>
    request(
      `/sessions/${sessionId}`,
      {
        method: 'DELETE',
      },
      userId
    ),
  updateTask: (taskId, payload, userId) =>
    request(
      `/tasks/${taskId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
      userId
    ),
  individualAnalytics: (userId) => request('/analytics/individual', {}, userId),
  groupAnalytics: (groupId, userId) => request(`/analytics/groups/${groupId}`, {}, userId),
}
