import Layout from '../components/Layout'
import { requireAuth } from '../lib/requireAuth'
import { useEffect, useState } from 'react'

export const getServerSideProps = requireAuth

export default function Tasks({ user }) {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignee, setAssignee] = useState('')
  const [users, setUsers] = useState([])

  async function load() {
    const [t,u] = await Promise.all([
      fetch('/api/tasks').then(r=>r.json()),
      fetch('/api/users').then(r=>r.json())
    ])
    setTasks(t)
    setUsers(u)
    if (!assignee && u.length) setAssignee(u[0].id)
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 4000)
    return () => clearInterval(id)
  }, [])

  async function createTask(e) {
    e.preventDefault()
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, assignee_id: assignee })
    })
    setTitle(''); setDescription('')
    load()
  }

  async function updateStatus(id, status) {
    await fetch('/api/tasks/'+id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    load()
  }

  return (
    <Layout user={user}>
      <div className="container">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 card p-4">
            <div className="text-lg font-semibold mb-3">Görevler</div>
            <div className="space-y-2">
              {tasks.map(t => (
                <div key={t.id} className="p-3 rounded border border-zinc-200 dark:border-zinc-700">
                  <div className="flex justify-between gap-2">
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-sm opacity-75">{t.description}</div>
                      <div className="text-xs opacity-60 mt-1">Atanan: {t.assignee_name || '—'} · Durum: {t.status}</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <select defaultValue={t.status} onChange={e=>updateStatus(t.id, e.target.value)} className="text-sm">
                        <option value="not_started">not_started</option>
                        <option value="in_progress">in_progress</option>
                        <option value="done">done</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-4">
            <div className="text-lg font-semibold mb-3">Yeni Görev (Yönetici)</div>
            {user.role !== 'admin' ? (
              <div className="text-sm opacity-70">Sadece yönetici görev oluşturabilir.</div>
            ) : (
              <form onSubmit={createTask} className="flex flex-col gap-2">
                <input value={title} onChange={e=>setTitle(e.target.value)} required placeholder="Başlık" />
                <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Açıklama" />
                <select value={assignee} onChange={e=>setAssignee(e.target.value)} required>
                  {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                </select>
                <button className="btn mt-1">Oluştur</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
