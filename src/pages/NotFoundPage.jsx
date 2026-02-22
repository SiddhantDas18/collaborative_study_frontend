import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <section className="panel text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-1 text-sm text-slate-500">The route you requested does not exist.</p>
        <Link to="/dashboard" className="btn-primary mt-4">
          Go to dashboard
        </Link>
      </section>
    </main>
  )
}
