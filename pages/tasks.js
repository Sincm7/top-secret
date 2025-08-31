import AppShell from '../components/shell/AppShell'
import { Sidebar } from '../components/shell/Sidebar'
import { requireAuth } from '../lib/requireAuth'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, Plus, Calendar, Users, Tag } from 'lucide-react'

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

  const columns = [
    { id: 'not_started', title: 'Backlog', color: 'bg-brand-1' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-brand-2' },
    { id: 'done', title: 'Done', color: 'bg-brand-4' }
  ]

  // TODO(aurora-refactor): Discord benzeri tasks sidebar - filtreler ve görünümler
  const sidebarContent = (
    <Sidebar>
      <div className="space-y-4">
        {/* Filters */}
        <div>
          <div className="mb-2 text-xs font-medium opacity-70 uppercase tracking-wider">Filters</div>
          <div className="space-y-1">
            {['All Tasks', 'My Tasks', 'High Priority', 'Overdue'].map(filter => (
              <motion.div
                key={filter}
                whileHover={{ x: 2 }}
                className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-white/5 cursor-pointer"
              >
                <Filter className="h-4 w-4 opacity-60" />
                <span className="opacity-80 group-hover:opacity-100">{filter}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        {user.role === 'admin' && (
          <div>
            <div className="mb-2 text-xs font-medium opacity-70 uppercase tracking-wider">Quick Actions</div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="glass w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:shadow-glow"
            >
              <Plus className="h-4 w-4" />
              New Task
            </motion.button>
          </div>
        )}
      </div>
    </Sidebar>
  )

  return (
    <AppShell title="Tasks" sidebar={sidebarContent}>
      <div className="space-y-6">
        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map(column => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={`h-3 w-3 rounded-full ${column.color}`} />
                <div className="text-sm font-medium opacity-90">{column.title}</div>
                <div className="ml-auto text-xs opacity-60">
                  {tasks.filter(t => t.status === column.id).length}
                </div>
              </div>
              
              <div className="space-y-3">
                {tasks
                  .filter(task => task.status === column.id)
                  .map(task => (
                    <motion.div
                      key={task.id}
                      whileHover={{ y: -2, scale: 1.01 }}
                      className="glass rounded-xl p-3 transition hover:shadow-glow cursor-pointer"
                    >
                      <div className="font-medium text-sm mb-1">{task.title}</div>
                      <div className="text-xs opacity-70 mb-2 line-clamp-2">{task.description}</div>
                      <div className="flex items-center justify-between text-xs opacity-60">
                        <span>{task.assignee_name || '—'}</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>2d</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Task Form (Admin Only) */}
        {user.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4"
          >
            <div className="text-sm font-medium mb-3 opacity-90">Create New Task</div>
            <form onSubmit={createTask} className="space-y-3">
              <input 
                value={title} 
                onChange={e=>setTitle(e.target.value)} 
                required 
                placeholder="Task title" 
                className="w-full"
              />
              <textarea 
                value={description} 
                onChange={e=>setDescription(e.target.value)} 
                placeholder="Description" 
                className="w-full resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <select 
                  value={assignee} 
                  onChange={e=>setAssignee(e.target.value)} 
                  required
                  className="flex-1"
                >
                  {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                </select>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="bg-brand-1 text-white px-4 py-2 rounded-xl transition hover:shadow-glow"
                >
                  Create
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </AppShell>
  )
}
