import { useState } from 'react'
import { useStudyPlanner } from '../context/StudyPlannerContext'

export default function ProfilePage() {
  const { user, groups, createGroup, joinGroup, error } = useStudyPlanner()
  const [groupName, setGroupName] = useState('')
  const [inviteGroupId, setInviteGroupId] = useState('')

  async function handleCreateGroup(event) {
    event.preventDefault()
    if (!groupName.trim()) return
    await createGroup(groupName.trim())
    setGroupName('')
  }

  async function handleJoin(event) {
    event.preventDefault()
    if (!inviteGroupId.trim()) return
    await joinGroup(inviteGroupId.trim())
    setInviteGroupId('')
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="panel">
        <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
        <div className="mt-3 space-y-1 text-sm text-slate-700">
          <p>
            <span className="font-medium">Name:</span> {user?.name || '-'}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user?.email || '-'}
          </p>
          <p>
            <span className="font-medium">Role:</span> {user?.role || '-'}
          </p>
          <p>
            <span className="font-medium">OAuth Provider:</span> {user?.oauthProvider || '-'}
          </p>
          <p className="break-all">
            <span className="font-medium">User ID:</span> {user?.id}
          </p>
        </div>
      </section>

      <section className="panel space-y-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Create Study Group</h3>
          <form onSubmit={handleCreateGroup} className="mt-2 flex gap-2">
            <input
              className="input-base"
              placeholder="New group name"
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
            />
            <button type="submit" className="btn-primary">
              Create
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900">Join Existing Group</h3>
          <form onSubmit={handleJoin} className="mt-2 flex gap-2">
            <input
              className="input-base"
              placeholder="Paste group id"
              value={inviteGroupId}
              onChange={(event) => setInviteGroupId(event.target.value)}
            />
            <button type="submit" className="btn-secondary">
              Join
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900">Your Groups</h3>
          <ul className="mt-2 space-y-2">
            {groups.map((group) => (
              <li key={group.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <p className="font-medium text-slate-800">{group.name}</p>
                <p className="break-all text-xs text-slate-500">{group.id}</p>
              </li>
            ))}
          </ul>
        </div>

        {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      </section>
    </div>
  )
}
