import { CompletionPie, IndividualBar } from '../components/AnalyticsCharts'
import MetricCard from '../components/MetricCard'
import { useStudyPlanner } from '../context/StudyPlannerContext'

export default function AnalyticsPage() {
  const { individualAnalytics, groupAnalytics } = useStudyPlanner()

  return (
    <div className="space-y-4">
      <section className="grid gap-3 md:grid-cols-3">
        <MetricCard title="Tasks Completed" value={individualAnalytics?.tasksCompleted ?? 0} />
        <MetricCard title="Tasks Assigned" value={individualAnalytics?.tasksAssigned ?? 0} />
        <MetricCard title="Sessions Attended" value={individualAnalytics?.sessionsAttended ?? 0} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="panel">
          <h3 className="mb-3 text-base font-semibold text-slate-900">Individual Performance</h3>
          <IndividualBar individualAnalytics={individualAnalytics} />
        </article>

        <article className="panel">
          <h3 className="mb-3 text-base font-semibold text-slate-900">Group Health</h3>
          <CompletionPie groupAnalytics={groupAnalytics} />
        </article>
      </section>

      <section className="panel">
        <h3 className="mb-2 text-base font-semibold text-slate-900">Summary</h3>
        <p className="text-sm text-slate-600">
          Group completion is <strong>{groupAnalytics?.groupCompletionRate ?? 0}%</strong>, participation is{' '}
          <strong>{groupAnalytics?.participationRate ?? 0}%</strong>, and consistency is{' '}
          <strong>{groupAnalytics?.consistencyScore ?? 0}%</strong>.
        </p>
      </section>
    </div>
  )
}
