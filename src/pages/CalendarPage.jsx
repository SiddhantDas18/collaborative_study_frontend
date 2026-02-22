import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import CalendarGrid from '../components/CalendarGrid'
import SessionCard from '../components/SessionCard'
import SessionModal from '../components/SessionModal'
import { useStudyPlanner } from '../context/StudyPlannerContext'

export default function CalendarPage() {
  const { sessions, createSession, updateTask, deleteSession } = useStudyPlanner()
  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  const [modalOpen, setModalOpen] = useState(false)

  const sortedSessions = useMemo(
    () => sessions.slice().sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()),
    [sessions]
  )

  function previousMonth() {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  function nextMonth() {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  return (
    <div className="space-y-4">
      <section className="panel">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button type="button" className="btn-secondary p-2" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-lg font-semibold text-slate-900">
              {currentMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
            </h2>
            <button type="button" className="btn-secondary p-2" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button type="button" className="btn-primary gap-2" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Quick Add Session
          </button>
        </div>

        <CalendarGrid sessions={sessions} monthDate={currentMonth} />
      </section>

      <section className="panel">
        <h3 className="mb-3 text-lg font-semibold text-slate-900">Session Timeline</h3>
        <div className="space-y-3">
          {sortedSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onDelete={deleteSession}
              onToggleTask={(task, patch) => updateTask(task.id, { ...patch, assignedTo: task.assigned_to })}
            />
          ))}
        </div>
      </section>

      <SessionModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={createSession} />
    </div>
  )
}
