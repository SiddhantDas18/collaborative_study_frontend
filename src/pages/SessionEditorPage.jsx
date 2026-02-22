import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SessionForm from '../components/SessionForm'
import { useStudyPlanner } from '../context/StudyPlannerContext'

export default function SessionEditorPage({ mode }) {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { sessions, createSession, updateSession, selectedGroupId } = useStudyPlanner()

  const session = useMemo(() => sessions.find((item) => item.id === sessionId), [sessions, sessionId])

  async function handleSubmit(payload) {
    if (!selectedGroupId) return

    if (mode === 'create') {
      await createSession(payload)
      navigate('/calendar')
      return
    }

    if (!sessionId) return

    await updateSession(sessionId, {
      title: payload.title,
      description: payload.description,
      startTime: payload.startTime,
      endTime: payload.endTime,
      zoomLink: payload.zoomLink,
      googleEventId: payload.googleEventId,
      status: payload.status,
    })

    navigate('/calendar')
  }

  if (mode === 'edit' && !session) {
    return (
      <section className="panel">
        <h2 className="text-lg font-semibold text-slate-900">Session not found</h2>
      </section>
    )
  }

  return (
    <section className="panel">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        {mode === 'create' ? 'Create Study Session' : 'Edit Study Session'}
      </h2>
      <SessionForm
        initialValue={session}
        onSubmit={handleSubmit}
        submitLabel={mode === 'create' ? 'Create Session' : 'Save Changes'}
      />
    </section>
  )
}
