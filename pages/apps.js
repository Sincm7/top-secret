import AppShell from '../components/shell/AppShell'
import { Sidebar } from '../components/shell/Sidebar'
import { requireAuth } from '../lib/requireAuth'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Upload, FolderOpen, Star, Clock, Settings } from 'lucide-react'

export const getServerSideProps = requireAuth

export default function Apps({ user }) {
  const [apps, setApps] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('downloadable')
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState('')

  async function load() {
    const res = await fetch('/api/apps')
    const data = await res.json()
    setApps(data)
  }

  useEffect(() => { load() }, [])

  async function upload(e) {
    e.preventDefault()
    setMsg('')
    if (!file) { setMsg('Dosya seçin'); return }
    const form = new FormData()
    form.append('file', file)
    form.append('name', name)
    form.append('description', description)
    form.append('status', status)
    const res = await fetch('/api/apps/upload', { method: 'POST', body: form })
    if (res.ok) { setMsg('Yüklendi'); setName(''); setDescription(''); setFile(null); load() }
    else setMsg('Yükleme başarısız')
  }

  // TODO(aurora-refactor): Discord benzeri apps sidebar - kategoriler ve filtreler
  const sidebarContent = (
    <Sidebar>
      <div className="space-y-4">
        {/* Categories */}
        <div>
          <div className="mb-2 text-xs font-medium opacity-70 uppercase tracking-wider">Categories</div>
          <div className="space-y-1">
            {['All Apps', 'Development', 'Production', 'Beta', 'Archived'].map(category => (
              <motion.div
                key={category}
                whileHover={{ x: 2 }}
                className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-white/5 cursor-pointer"
              >
                <FolderOpen className="h-4 w-4 opacity-60" />
                <span className="opacity-80 group-hover:opacity-100">{category}</span>
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
              <Upload className="h-4 w-4" />
              Upload App
            </motion.button>
          </div>
        )}
      </div>
    </Sidebar>
  )

  const getStatusColor = (status) => {
    switch(status) {
      case 'development': return 'bg-brand-2'
      case 'update': return 'bg-brand-3'
      case 'downloadable': return 'bg-brand-4'
      default: return 'bg-muted'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'development': return <Settings className="h-3 w-3" />
      case 'update': return <Clock className="h-3 w-3" />
      case 'downloadable': return <Download className="h-3 w-3" />
      default: return <Star className="h-3 w-3" />
    }
  }

  return (
    <AppShell title="Apps" sidebar={sidebarContent}>
      <div className="space-y-6">
        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {apps.map(app => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, scale: 1.02, rotate: -0.5 }}
              className="glass group rounded-2xl p-4 transition duration-300 ease-out-expo hover:shadow-glow cursor-pointer"
            >
              {/* App Icon/Preview */}
              <div className="mb-4 h-24 rounded-xl bg-gradient-to-br from-brand-1/20 to-brand-2/20 flex items-center justify-center">
                <Download className="h-8 w-8 opacity-60" />
              </div>
              
              {/* App Info */}
              <div className="space-y-2">
                <div className="font-medium text-sm">{app.name}</div>
                <div className="text-xs opacity-70 line-clamp-2">{app.description}</div>
                
                {/* Status and Size */}
                <div className="flex items-center justify-between text-xs opacity-60">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(app.status)}
                    <span className="capitalize">{app.status}</span>
                  </div>
                  <span>{Math.round((app.size||0)/1024)} KB</span>
                </div>
                
                {/* Tags */}
                <div className="flex gap-1">
                  <span className={`${getStatusColor(app.status)} rounded-lg px-2 py-0.5 text-xs opacity-80`}>
                    {app.status}
                  </span>
                  <span className="glass rounded-lg px-2 py-0.5 text-xs opacity-80">
                    {app.size ? 'File' : 'Link'}
                  </span>
                </div>
              </div>
              
              {/* Download Button */}
              {app.download_url && (
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={app.download_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 w-full bg-brand-1 text-white text-center rounded-xl px-3 py-2 text-sm font-medium transition hover:shadow-glow"
                >
                  Download
                </motion.a>
              )}
            </motion.div>
          ))}
        </div>

        {/* Upload Form (Admin Only) */}
        {user.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4"
          >
            <div className="text-sm font-medium mb-3 opacity-90">Upload New App</div>
            <form onSubmit={upload} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input 
                  value={name} 
                  onChange={e=>setName(e.target.value)} 
                  required 
                  placeholder="App name" 
                />
                <select 
                  value={status} 
                  onChange={e=>setStatus(e.target.value)}
                  className="w-full"
                >
                  <option value="development">Development</option>
                  <option value="update">Update</option>
                  <option value="downloadable">Downloadable</option>
                </select>
              </div>
              <textarea 
                value={description} 
                onChange={e=>setDescription(e.target.value)} 
                placeholder="Description" 
                className="w-full resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <input 
                  type="file" 
                  onChange={e=>setFile(e.target.files[0])} 
                  accept=".py,.exe,.zip,.txt,.pdf,.png,.jpg"
                  className="flex-1"
                />
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="bg-brand-1 text-white px-4 py-2 rounded-xl transition hover:shadow-glow"
                >
                  Upload
                </motion.button>
              </div>
              {msg && <div className="text-sm opacity-70">{msg}</div>}
            </form>
          </motion.div>
        )}
      </div>
    </AppShell>
  )
}
