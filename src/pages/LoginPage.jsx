import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStudyPlanner } from '../context/StudyPlannerContext'

const initialForm = {
  provider: 'google',
  oauthId: '',
  name: '',
  email: '',
}

export default function LoginPage() {
  const [form, setForm] = useState(initialForm)
  const { login, loading, error, clearError } = useStudyPlanner()
  const navigate = useNavigate()
  const location = useLocation()

  const nextPath = location.state?.from || '/dashboard'

  async function handleSubmit(event) {
    event.preventDefault()
    clearError()
    try {
      await login(form)
      navigate(nextPath, { replace: true })
    } catch {
      // handled by context error state
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-100 via-slate-100 to-emerald-100 p-4">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold text-slate-900">Collaborative Study Planner</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in with OAuth profile details (POC mode)</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-600">Provider</span>
            <select
              className="input-base"
              value={form.provider}
              onChange={(event) => setForm((prev) => ({ ...prev, provider: event.target.value }))}
            >
              <option value="google">Google</option>
              <option value="facebook">Facebook</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-600">OAuth Subject ID</span>
            <input
              className="input-base"
              required
              value={form.oauthId}
              onChange={(event) => setForm((prev) => ({ ...prev, oauthId: event.target.value }))}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-600">Name</span>
              <input
                className="input-base"
                required
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-600">Email</span>
              <input
                className="input-base"
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </label>
          </div>

          {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  )
}
