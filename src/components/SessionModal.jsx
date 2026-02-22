import SessionForm from './SessionForm'

export default function SessionModal({ open, onClose, onSubmit }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Create Study Session</h3>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>

        <SessionForm
          onSubmit={(payload) => {
            onSubmit(payload)
            onClose()
          }}
          submitLabel="Create Session"
        />
      </div>
    </div>
  )
}
