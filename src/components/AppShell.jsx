import clsx from 'clsx'
import { Activity, CalendarDays, LayoutDashboard, LogOut, UserCircle2 } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useStudyPlanner } from '../context/StudyPlannerContext'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/analytics', label: 'Analytics', icon: Activity },
  { to: '/profile', label: 'Profile', icon: UserCircle2 },
]

export default function AppShell() {
  const { groups, selectedGroupId, setSelectedGroupId, connectionState, logout } = useStudyPlanner()

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-slate-100 to-emerald-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] gap-4 p-4">
        <aside className="hidden w-64 shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft md:flex md:flex-col">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Study Planner</h1>
            <p className="text-xs text-slate-500">Real-time collaboration</p>
          </div>

          <nav className="mt-6 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-brand-100 text-brand-800'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  )
                }
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          <button type="button" className="btn-secondary mt-auto gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="panel flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Collaborative Study Workspace</h2>
              <p className="text-sm text-slate-500">Shared calendar, live updates, and accountability insights</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                className="input-base min-w-64"
                value={selectedGroupId}
                onChange={(event) => setSelectedGroupId(event.target.value)}
              >
                {groups.length === 0 ? <option value="">No groups yet</option> : null}
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>

              <span
                className={clsx(
                  'rounded-full px-3 py-1 text-xs font-medium',
                  connectionState === 'connected'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                )}
              >
                {connectionState === 'connected' ? 'Live sync connected' : 'Realtime disconnected'}
              </span>
            </div>
          </header>

          <div className="min-h-0 flex-1">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  )
}
