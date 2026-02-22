import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { apiClient } from '../api/client'
import { connectRealtime } from '../realtime/socketClient'

const STORAGE_KEY = 'study_planner_user'

const StudyPlannerContext = createContext(null)

function mergeSession(list, incoming) {
  const exists = list.some((item) => item.id === incoming.id)
  if (!exists) return [...list, incoming]
  return list.map((item) => (item.id === incoming.id ? incoming : item))
}

export function StudyPlannerProvider({ children }) {
  const [user, setUser] = useState(null)
  const [groups, setGroups] = useState([])
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [sessions, setSessions] = useState([])
  const [individualAnalytics, setIndividualAnalytics] = useState(null)
  const [groupAnalytics, setGroupAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [connectionState, setConnectionState] = useState('disconnected')

  const socketRef = useRef(null)

  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) || null,
    [groups, selectedGroupId]
  )

  const clearError = useCallback(() => setError(''), [])

  const hydrateStoredUser = useCallback(async () => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw)
      if (!parsed?.id) return

      const meData = await apiClient.me(parsed.id)
      setUser(meData.user)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const refreshGroups = useCallback(
    async (userId) => {
      const data = await apiClient.listGroups(userId)
      const nextGroups = data.groups || []
      setGroups(nextGroups)

      setSelectedGroupId((prev) => {
        if (prev && nextGroups.some((group) => group.id === prev)) return prev
        return nextGroups[0]?.id || ''
      })

      return nextGroups
    },
    [setGroups]
  )

  const refreshSessions = useCallback(
    async (groupId, userId) => {
      if (!groupId) {
        setSessions([])
        return []
      }

      const data = await apiClient.listSessions(groupId, userId)
      const nextSessions = data.sessions || []
      setSessions(nextSessions)
      return nextSessions
    },
    [setSessions]
  )

  const refreshAnalytics = useCallback(
    async (groupId, userId) => {
      if (!userId) return

      const individual = await apiClient.individualAnalytics(userId)
      setIndividualAnalytics(individual)

      if (groupId) {
        const group = await apiClient.groupAnalytics(groupId, userId)
        setGroupAnalytics(group)
      } else {
        setGroupAnalytics(null)
      }
    },
    [setIndividualAnalytics, setGroupAnalytics]
  )

  const refreshAll = useCallback(
    async (forcedUserId, forcedGroupId) => {
      const activeUserId = forcedUserId || user?.id
      const activeGroupId = forcedGroupId || selectedGroupId
      if (!activeUserId) return

      await refreshGroups(activeUserId)
      await Promise.all([refreshSessions(activeGroupId, activeUserId), refreshAnalytics(activeGroupId, activeUserId)])
    },
    [refreshAnalytics, refreshGroups, refreshSessions, selectedGroupId, user?.id]
  )

  const login = useCallback(
    async (payload) => {
      setLoading(true)
      clearError()
      try {
        const data = await apiClient.oauthLogin(payload)
        setUser(data.user)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user))
        const nextGroups = await refreshGroups(data.user.id)
        const initialGroupId = nextGroups[0]?.id || ''
        if (initialGroupId) {
          await refreshSessions(initialGroupId, data.user.id)
          await refreshAnalytics(initialGroupId, data.user.id)
        } else {
          await refreshAnalytics('', data.user.id)
        }
        return data.user
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [clearError, refreshAnalytics, refreshGroups, refreshSessions]
  )

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    setGroups([])
    setSelectedGroupId('')
    setSessions([])
    setIndividualAnalytics(null)
    setGroupAnalytics(null)
    socketRef.current?.disconnect()
    socketRef.current = null
    setConnectionState('disconnected')
  }, [])

  const createGroup = useCallback(
    async (name) => {
      if (!user?.id) return
      clearError()
      try {
        const result = await apiClient.createGroup(name, user.id)
        await refreshGroups(user.id)
        setSelectedGroupId(result.group.id)
      } catch (err) {
        setError(err.message)
        throw err
      }
    },
    [clearError, refreshGroups, user?.id]
  )

  const joinGroup = useCallback(
    async (groupId) => {
      if (!user?.id) return
      clearError()
      try {
        await apiClient.joinGroup(groupId, user.id)
        await refreshGroups(user.id)
        setSelectedGroupId(groupId)
      } catch (err) {
        setError(err.message)
        throw err
      }
    },
    [clearError, refreshGroups, user?.id]
  )

  const createSession = useCallback(
    async (payload) => {
      if (!user?.id || !selectedGroupId) return null
      clearError()

      const optimisticId = `temp-${Date.now()}`
      const optimistic = {
        id: optimisticId,
        group_id: selectedGroupId,
        title: payload.title,
        description: payload.description || null,
        start_time: payload.startTime,
        end_time: payload.endTime,
        zoom_link: payload.zoomLink || null,
        google_event_id: payload.googleEventId || null,
        status: payload.status || 'scheduled',
        tasks: (payload.tasks || []).map((task, index) => ({
          id: `${optimisticId}-task-${index}`,
          title: task.title,
          assigned_to: task.assignedTo || null,
          completed: false,
        })),
      }

      setSessions((prev) => [...prev, optimistic])

      try {
        const result = await apiClient.createSession(selectedGroupId, payload, user.id)
        setSessions((prev) => prev.filter((item) => item.id !== optimisticId))
        setSessions((prev) => mergeSession(prev, result.session))
        await refreshAnalytics(selectedGroupId, user.id)
        return result.session
      } catch (err) {
        setSessions((prev) => prev.filter((item) => item.id !== optimisticId))
        setError(err.message)
        throw err
      }
    },
    [clearError, refreshAnalytics, selectedGroupId, user?.id]
  )

  const updateSession = useCallback(
    async (sessionId, payload) => {
      if (!user?.id) return null
      clearError()
      try {
        const result = await apiClient.updateSession(sessionId, payload, user.id)
        setSessions((prev) => mergeSession(prev, result.session))
        await refreshAnalytics(selectedGroupId, user.id)
        return result.session
      } catch (err) {
        setError(err.message)
        throw err
      }
    },
    [clearError, refreshAnalytics, selectedGroupId, user?.id]
  )

  const deleteSession = useCallback(
    async (sessionId) => {
      if (!user?.id) return
      clearError()
      const original = sessions
      setSessions((prev) => prev.filter((session) => session.id !== sessionId))

      try {
        await apiClient.deleteSession(sessionId, user.id)
        await refreshAnalytics(selectedGroupId, user.id)
      } catch (err) {
        setSessions(original)
        setError(err.message)
        throw err
      }
    },
    [clearError, refreshAnalytics, selectedGroupId, sessions, user?.id]
  )

  const updateTask = useCallback(
    async (taskId, payload) => {
      if (!user?.id) return
      clearError()
      try {
        await apiClient.updateTask(taskId, payload, user.id)
        await refreshSessions(selectedGroupId, user.id)
        await refreshAnalytics(selectedGroupId, user.id)
      } catch (err) {
        setError(err.message)
        throw err
      }
    },
    [clearError, refreshAnalytics, refreshSessions, selectedGroupId, user?.id]
  )

  useEffect(() => {
    hydrateStoredUser()
  }, [hydrateStoredUser])

  useEffect(() => {
    if (!user?.id) return

    refreshGroups(user.id).catch((err) => setError(err.message))
  }, [refreshGroups, user?.id])

  useEffect(() => {
    if (!user?.id || !selectedGroupId) return

    Promise.all([
      refreshSessions(selectedGroupId, user.id),
      refreshAnalytics(selectedGroupId, user.id),
    ]).catch((err) => setError(err.message))
  }, [refreshAnalytics, refreshSessions, selectedGroupId, user?.id])

  useEffect(() => {
    if (!user?.id) return

    const socket = connectRealtime(user.id)
    socketRef.current = socket

    socket.on('connect', () => {
      setConnectionState('connected')
      if (selectedGroupId) {
        socket.emit('group:join', selectedGroupId)
      }
    })

    socket.on('disconnect', () => {
      setConnectionState('disconnected')
    })

    socket.on('session:created', (session) => {
      if (!session || session.group_id !== selectedGroupId) return
      setSessions((prev) => mergeSession(prev.filter((item) => !String(item.id).startsWith('temp-')), session))
    })

    socket.on('session:updated', (session) => {
      if (!session || session.group_id !== selectedGroupId) return
      setSessions((prev) => mergeSession(prev, session))
    })

    socket.on('session:deleted', (payload) => {
      if (!payload?.id || payload.groupId !== selectedGroupId) return
      setSessions((prev) => prev.filter((item) => item.id !== payload.id))
    })

    socket.on('progress:updated', () => {
      refreshAnalytics(selectedGroupId, user.id).catch(() => {})
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
      setConnectionState('disconnected')
    }
  }, [refreshAnalytics, selectedGroupId, user?.id])

  useEffect(() => {
    if (!socketRef.current || !selectedGroupId) return
    socketRef.current.emit('group:join', selectedGroupId)
  }, [selectedGroupId])

  const value = useMemo(
    () => ({
      user,
      groups,
      selectedGroup,
      selectedGroupId,
      sessions,
      individualAnalytics,
      groupAnalytics,
      loading,
      error,
      connectionState,
      setSelectedGroupId,
      clearError,
      login,
      logout,
      createGroup,
      joinGroup,
      createSession,
      updateSession,
      deleteSession,
      updateTask,
      refreshAll,
    }),
    [
      connectionState,
      createGroup,
      createSession,
      deleteSession,
      error,
      groupAnalytics,
      groups,
      individualAnalytics,
      joinGroup,
      loading,
      login,
      logout,
      refreshAll,
      selectedGroup,
      selectedGroupId,
      sessions,
      updateSession,
      updateTask,
      user,
      clearError,
    ]
  )

  return <StudyPlannerContext.Provider value={value}>{children}</StudyPlannerContext.Provider>
}

export function useStudyPlanner() {
  const context = useContext(StudyPlannerContext)
  if (!context) {
    throw new Error('useStudyPlanner must be used within StudyPlannerProvider')
  }
  return context
}
