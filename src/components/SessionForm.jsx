import { useMemo, useState } from 'react'
import { toLocalInputValue } from '../utils/date'

const initialTask = { title: '', assignedTo: '' }

export default function SessionForm({ initialValue, onSubmit, submitLabel = 'Save Session' }) {
  const [form, setForm] = useState(() => ({
    title: initialValue?.title || '',
    description: initialValue?.description || '',
    startTime: toLocalInputValue(initialValue?.start_time || initialValue?.startTime),
    endTime: toLocalInputValue(initialValue?.end_time || initialValue?.endTime),
    zoomLink: initialValue?.zoom_link || '',
    googleEventId: initialValue?.google_event_id || '',
    status: initialValue?.status || 'scheduled',
  }))

  const [tasks, setTasks] = useState(() => {
    if (initialValue?.tasks?.length) {
      return initialValue.tasks.map((task) => ({
        title: task.title,
        assignedTo: task.assigned_to || '',
      }))
    }
    return [initialTask]
  })

  const validTasks = useMemo(() => tasks.filter((task) => task.title.trim()), [tasks])

  function updateTask(index, key, value) {
    setTasks((prev) => prev.map((task, i) => (i === index ? { ...task, [key]: value } : task)))
  }

  function addTask() {
    setTasks((prev) => [...prev, initialTask])
  }

  function removeTask(index) {
    setTasks((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit({
      ...form,
      tasks: validTasks,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">Title</span>
          <input
            required
            className="input-base"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">Status</span>
          <select
            className="input-base"
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-600">Description</span>
        <textarea
          className="input-base min-h-24"
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">Start Time</span>
          <input
            required
            type="datetime-local"
            className="input-base"
            value={form.startTime}
            onChange={(event) => setForm((prev) => ({ ...prev, startTime: event.target.value }))}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">End Time</span>
          <input
            required
            type="datetime-local"
            className="input-base"
            value={form.endTime}
            onChange={(event) => setForm((prev) => ({ ...prev, endTime: event.target.value }))}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">Zoom Link</span>
          <input
            className="input-base"
            value={form.zoomLink}
            onChange={(event) => setForm((prev) => ({ ...prev, zoomLink: event.target.value }))}
            placeholder="https://zoom.us/j/..."
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">Google Event ID</span>
          <input
            className="input-base"
            value={form.googleEventId}
            onChange={(event) => setForm((prev) => ({ ...prev, googleEventId: event.target.value }))}
          />
        </label>
      </div>

      <div className="space-y-2 rounded-xl border border-slate-200 p-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-800">Task List</h4>
          <button type="button" className="btn-secondary px-3 py-1.5 text-xs" onClick={addTask}>
            Add task
          </button>
        </div>

        <div className="space-y-2">
          {tasks.map((task, index) => (
            <div key={`${task.title}-${index}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <input
                className="input-base"
                placeholder="Task title"
                value={task.title}
                onChange={(event) => updateTask(index, 'title', event.target.value)}
              />
              <input
                className="input-base"
                placeholder="Assigned user id (optional)"
                value={task.assignedTo}
                onChange={(event) => updateTask(index, 'assignedTo', event.target.value)}
              />
              <button type="button" className="btn-secondary px-3 py-2 text-xs" onClick={() => removeTask(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary">
        {submitLabel}
      </button>
    </form>
  )
}
