import { CheckCircle2, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { prettyDateTime } from '../utils/date'

export default function SessionCard({ session, onToggleTask, onDelete }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900">{session.title}</h3>
          <p className="text-xs text-slate-500">
            {prettyDateTime(session.start_time)} - {prettyDateTime(session.end_time)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{session.status}</span>
          <Link to={`/sessions/${session.id}/edit`} className="btn-secondary gap-1 px-3 py-1.5 text-xs">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>
          <button type="button" className="btn-secondary gap-1 px-3 py-1.5 text-xs" onClick={() => onDelete(session.id)}>
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-700">{session.description || 'No description provided.'}</p>

      {session.zoom_link ? (
        <a className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-700" href={session.zoom_link} target="_blank" rel="noreferrer">
          Join Zoom
          <ExternalLink className="h-4 w-4" />
        </a>
      ) : null}

      <div className="mt-4 border-t border-slate-200 pt-3">
        <h4 className="mb-2 text-sm font-medium text-slate-700">Tasks</h4>

        {!session.tasks?.length ? <p className="text-xs text-slate-500">No tasks in this session yet.</p> : null}

        <ul className="space-y-2">
          {(session.tasks || []).map((task) => (
            <li key={task.id}>
              <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2">
                <span className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(task.completed)}
                    onChange={() =>
                      onToggleTask(task, {
                        completed: !task.completed,
                      })
                    }
                  />
                  <span className={task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}>{task.title}</span>
                </span>

                {task.completed ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : null}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
