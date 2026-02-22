import { Link } from 'react-router-dom'
import MetricCard from '../components/MetricCard'
import SessionCard from '../components/SessionCard'
import { useStudyPlanner } from '../context/StudyPlannerContext'

export default function DashboardPage() {
  const {
    selectedGroup,
    sessions,
    individualAnalytics,
    groupAnalytics,
    updateTask,
    deleteSession,
    error,
  } = useStudyPlanner()

  const upcoming = sessions
    .slice()
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 4)

  return (
    <div className="space-y-4">
      <section className="grid gap-3 md:grid-cols-4">
        <MetricCard title="Active Group" value={selectedGroup?.name || 'No group selected'} />
        <MetricCard title="Sessions" value={sessions.length} subtitle="In selected group" />
        <MetricCard title="Completion Rate" value={`${individualAnalytics?.completionRate ?? 0}%`} subtitle="Your tasks" />
        <MetricCard title="Group Participation" value={`${groupAnalytics?.participationRate ?? 0}%`} subtitle="Collaborative activity" />
      </section>

      <section className="panel">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming Sessions</h2>
          <Link to="/sessions/new" className="btn-primary">
            New Session
          </Link>
        </div>

        {!upcoming.length ? <p className="text-sm text-slate-500">Create your first session to start collaborating.</p> : null}

        <div className="space-y-3">
          {upcoming.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onDelete={deleteSession}
              onToggleTask={(task, patch) => updateTask(task.id, { ...patch, assignedTo: task.assigned_to })}
            />
          ))}
        </div>

        {error ? <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      </section>
    </div>
  )
}
