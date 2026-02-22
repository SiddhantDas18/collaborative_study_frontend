import { dayKey, monthMatrix } from '../utils/date'

export default function CalendarGrid({ sessions, monthDate }) {
  const rows = monthMatrix(monthDate.getFullYear(), monthDate.getMonth())

  const sessionsByDay = sessions.reduce((acc, session) => {
    const key = dayKey(session.start_time)
    if (!acc[key]) acc[key] = []
    acc[key].push(session)
    return acc
  }, {})

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="grid grid-cols-7 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="border-b border-r border-slate-200 px-2 py-2 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {rows.map((week, weekIndex) => (
        <div key={weekIndex} className="grid grid-cols-7">
          {week.map((date, dayIndex) => {
            const key = date ? dayKey(date) : `empty-${weekIndex}-${dayIndex}`
            const daySessions = date ? sessionsByDay[key] || [] : []
            return (
              <div key={key} className="min-h-32 border-b border-r border-slate-200 p-2 last:border-r-0">
                {date ? <p className="text-xs font-semibold text-slate-700">{date.getDate()}</p> : null}
                <div className="mt-2 space-y-1">
                  {daySessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="rounded bg-brand-100 px-2 py-1 text-xs text-brand-800">
                      {session.title}
                    </div>
                  ))}
                  {daySessions.length > 3 ? (
                    <div className="text-[11px] font-medium text-slate-500">+{daySessions.length - 3} more</div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
