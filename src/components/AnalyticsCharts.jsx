import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from 'recharts'

const PIE_COLORS = ['#3f79ef', '#93c5fd', '#16a34a']

export function CompletionPie({ groupAnalytics }) {
  const completion = Number(groupAnalytics?.groupCompletionRate || 0)
  const participation = Number(groupAnalytics?.participationRate || 0)
  const consistency = Number(groupAnalytics?.consistencyScore || 0)

  const data = [
    { name: 'Completion', value: completion },
    { name: 'Participation', value: participation },
    { name: 'Consistency', value: consistency },
  ]

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function IndividualBar({ individualAnalytics }) {
  const data = [
    { name: 'Completed Tasks', value: Number(individualAnalytics?.tasksCompleted || 0) },
    { name: 'Assigned Tasks', value: Number(individualAnalytics?.tasksAssigned || 0) },
    { name: 'Sessions Attended', value: Number(individualAnalytics?.sessionsAttended || 0) },
  ]

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value" fill="#3f79ef" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
