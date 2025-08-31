import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Shield, User, Lock, LogIn, Building, ShoppingCart } from 'lucide-react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [project, setProject] = useState(process.env.NEXT_PUBLIC_PROJECT_NAME || 'Top Secret')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, project, password })
    })
    if (res.ok) router.replace('/chat')
    else setError('Giriş başarısız. Bilgileri kontrol edin.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
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

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:justify-center lg:items-center">
        {/* Login Form - Centered */}
        <div className="glass rounded-3xl p-8 w-full max-w-md mx-auto mb-8 lg:mb-0">
          <div className="text-center mb-6">
            <div className="glass rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <LogIn className="h-8 w-8 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Portal'a Giriş Yap</h1>
            <p className="text-sm opacity-70">Güvenli erişim için bilgilerinizi girin</p>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium opacity-80">
                <User className="h-4 w-4" />
                Kullanıcı Adı
              </label>
              <input 
                value={username} 
                onChange={e=>setUsername(e.target.value)} 
                required 
                placeholder="kullanici" 
                className="w-full glass rounded-xl px-4 py-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500/30 hover:shadow-glow"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium opacity-80">
                <Building className="h-4 w-4" />
                Proje Adı
              </label>
              <input 
                value={project} 
                onChange={e=>setProject(e.target.value)} 
                required 
                placeholder="Top Secret" 
                className="w-full glass rounded-xl px-4 py-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500/30 hover:shadow-glow"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium opacity-80">
                <Lock className="h-4 w-4" />
                Şifre
              </label>
              <input 
                type="password" 
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                required 
                placeholder="••••••••" 
                className="w-full glass rounded-xl px-4 py-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500/30 hover:shadow-glow"
              />
            </div>
            
            {error && (
              <div className="glass rounded-xl px-4 py-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20">
                {error}
              </div>
            )}
            
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Giriş Yap
            </button>
          </form>
        </div>

        {/* Proje Satın Al Panel - Fixed on Right */}
        <aside className="glass rounded-2xl p-6 w-80 ml-[30px] fixed right-4 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Proje Satın Al</h3>
          </div>
          <p className="text-sm opacity-80 mb-4 leading-relaxed">
            TopSecret ile sohbet, görev, uygulamalar ve admin'i tek yerde topla. 
            Discord-vari arayüz, cam/blur kartlar, dark/light tema.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center w-full rounded-xl px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Fiyatları Gör
          </Link>
        </aside>

        {/* Mobile Proje Satın Al Panel */}
        <aside className="glass rounded-2xl p-6 w-full max-w-md mx-auto lg:hidden">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Proje Satın Al</h3>
          </div>
          <p className="text-sm opacity-80 mb-4 leading-relaxed">
            TopSecret ile sohbet, görev, uygulamalar ve admin'i tek yerde topla. 
            Discord-vari arayüz, cam/blur kartlar, dark/light tema.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center w-full rounded-xl px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Fiyatları Gör
          </Link>
        </aside>
      </div>
    </div>
  )
}
