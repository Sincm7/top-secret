import { useState } from 'react'
import { useRouter } from 'next/router'

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Portal'a Giriş Yap</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span>Kullanıcı Adı</span>
            <input value={username} onChange={e=>setUsername(e.target.value)} required placeholder="kullanici" />
          </label>
          <label className="flex flex-col gap-1">
            <span>Proje Adı</span>
            <input value={project} onChange={e=>setProject(e.target.value)} required placeholder="Top Secret" />
          </label>
          <label className="flex flex-col gap-1">
            <span>Şifre</span>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" />
          </label>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="btn mt-2">Giriş Yap</button>
        </form>
      </div>
    </div>
  )
}
