import { useState } from 'react'
import { Shield, User, Lock, Settings } from 'lucide-react'

export default function Init() {
  const [secret, setSecret] = useState('')
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')

  async function init(e) {
    e.preventDefault()
    const res = await fetch('/api/init-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, username, password })
    })
    alert(res.ok ? 'Admin oluşturuldu' : 'Hata: setup başarısız')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Aurora Background */}
      <div className="aurora-bg" />
      <div className="noise-overlay" />
      
      {/* Top Secret Header */}
      <div className="absolute top-6 left-6 z-10">
        <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          <span className="font-semibold text-lg">Top Secret</span>
        </div>
      </div>

      {/* Main Form */}
      <div className="glass rounded-3xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <div className="glass rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Settings className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">İlk Admin Kurulumu</h1>
          <p className="text-sm opacity-70">Bu sayfayı yalnızca ilk kurulum için kullanın ve sonra silin.</p>
        </div>
        
        <form onSubmit={init} className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium opacity-80">
              <Lock className="h-4 w-4" />
              Admin Init Secret
            </label>
            <input 
              placeholder="ADMIN_INIT_SECRET" 
              value={secret} 
              onChange={e=>setSecret(e.target.value)} 
              required 
              className="w-full glass rounded-xl px-4 py-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500/30 hover:shadow-glow"
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium opacity-80">
              <User className="h-4 w-4" />
              Admin Kullanıcı Adı
            </label>
            <input 
              placeholder="admin kullanıcı adı" 
              value={username} 
              onChange={e=>setUsername(e.target.value)} 
              required 
              className="w-full glass rounded-xl px-4 py-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500/30 hover:shadow-glow"
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium opacity-80">
              <Lock className="h-4 w-4" />
              Admin Şifresi
            </label>
            <input 
              type="password" 
              placeholder="admin şifresi" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              required 
              className="w-full glass rounded-xl px-4 py-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500/30 hover:shadow-glow"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-glow active:scale-[0.98]"
          >
            Admin Kurulumunu Tamamla
          </button>
        </form>
      </div>
    </div>
  )
}
