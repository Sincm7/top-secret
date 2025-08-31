import AppShell from '../components/shell/AppShell'
import { Sidebar } from '../components/shell/Sidebar'
import { requireAuth } from '../lib/requireAuth'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Settings, Activity, Shield, Plus, UserPlus, BarChart3 } from 'lucide-react'

export const getServerSideProps = requireAuth

export default function Admin({ user }) {
  const [users, setUsers] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('member')
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  async function load() {
    const res = await fetch('/api/users')
    const data = await res.json()
    setUsers(data)
  }

  useEffect(() => { load() }, [])

  async function createUser(e) {
    e.preventDefault()
    setError(''); setOk('')
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    })
    if (res.ok) { setOk('Kullanıcı oluşturuldu'); setUsername(''); setPassword(''); load() }
    else setError('Hata: yetki veya doğrulama sorunu.')
  }

  if (user.role !== 'admin') {
    return (
      <AppShell title="Admin">
        <div className="glass rounded-2xl p-8 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 opacity-60" />
          <div className="text-lg font-medium mb-2">Access Denied</div>
          <div className="text-sm opacity-70">Only administrators can access this page.</div>
        </div>
      </AppShell>
    )
  }

  // TODO(aurora-refactor): Discord benzeri admin sidebar - ayarlar ve navigasyon
  const sidebarContent = (
    <Sidebar>
      <div className="space-y-4">
        {/* Admin Navigation */}
        <div>
          <div className="mb-2 text-xs font-medium opacity-70 uppercase tracking-wider">Admin Panel</div>
          <div className="space-y-1">
            {['Dashboard', 'Users', 'Settings', 'Analytics', 'Logs'].map(item => (
              <motion.div
                key={item}
                whileHover={{ x: 2 }}
                className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-white/5 cursor-pointer"
              >
                <Settings className="h-4 w-4 opacity-60" />
                <span className="opacity-80 group-hover:opacity-100">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="mb-2 text-xs font-medium opacity-70 uppercase tracking-wider">Quick Actions</div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="glass w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:shadow-glow"
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </motion.button>
        </div>
      </div>
    </Sidebar>
  )

  const metrics = [
    { title: 'Total Users', value: users.length, icon: Users, color: 'bg-brand-1' },
    { title: 'Active Users', value: users.filter(u => u.role === 'member').length, icon: Activity, color: 'bg-brand-2' },
    { title: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: Shield, color: 'bg-brand-3' },
    { title: 'System Status', value: 'Online', icon: BarChart3, color: 'bg-brand-4' }
  ]

  return (
    <AppShell title="Admin" sidebar={sidebarContent}>
      <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2, scale: 1.01 }}
              className="glass rounded-2xl p-4 transition hover:shadow-glow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs opacity-70 mb-1">{metric.title}</div>
                  <div className="text-2xl font-semibold">{metric.value}</div>
                </div>
                <div className={`${metric.color} p-2 rounded-xl`}>
                  <metric.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5" />
              <div className="text-sm font-medium opacity-90">Users</div>
            </div>
            <div className="space-y-2">
              {users.map(u => (
                <motion.div
                  key={u.id}
                  whileHover={{ x: 2 }}
                  className="flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-1 to-brand-2 flex items-center justify-center text-white text-sm font-medium">
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{u.username}</div>
                      <div className="text-xs opacity-60">ID: {u.id}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    u.role === 'admin' ? 'bg-brand-3/20 text-brand-3' : 'bg-brand-1/20 text-brand-1'
                  }`}>
                    {u.role}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Create User Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="h-5 w-5" />
              <div className="text-sm font-medium opacity-90">Add New User</div>
            </div>
            <form onSubmit={createUser} className="space-y-3">
              <input 
                value={username} 
                onChange={e=>setUsername(e.target.value)} 
                required 
                placeholder="Username" 
                className="w-full"
              />
              <input 
                type="password" 
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                required 
                placeholder="Password" 
                className="w-full"
              />
              <select 
                value={role} 
                onChange={e=>setRole(e.target.value)}
                className="w-full bg-transparent"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              
              {error && (
                <div className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
              {ok && (
                <div className="text-sm text-green-400 bg-green-400/10 rounded-lg px-3 py-2">
                  {ok}
                </div>
              )}
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-brand-1 text-white px-4 py-2 rounded-xl transition hover:shadow-glow"
              >
                Create User
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5" />
            <div className="text-sm font-medium opacity-90">Recent Activity</div>
          </div>
          <div className="divide-y divide-subtle">
            {[
              { action: 'User created', user: 'admin', time: '2 minutes ago' },
              { action: 'App uploaded', user: 'mert', time: '5 minutes ago' },
              { action: 'Task completed', user: 'sinan', time: '10 minutes ago' },
              { action: 'System backup', user: 'system', time: '1 hour ago' }
            ].map((activity, index) => (
              <div key={index} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-brand-2" />
                  <div>
                    <div className="text-sm">{activity.action}</div>
                    <div className="text-xs opacity-60">by {activity.user}</div>
                  </div>
                </div>
                <div className="text-xs opacity-60">{activity.time}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}
