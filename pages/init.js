import { useState } from 'react'

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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card p-6 w-full max-w-md">
        <h1 className="text-xl font-semibold mb-3">İlk Admin Kurulumu</h1>
        <p className="text-sm opacity-75 mb-3">Bu sayfayı yalnızca ilk kurulum için kullanın ve sonra silin.</p>
        <form onSubmit={init} className="flex flex-col gap-2">
          <input placeholder="ADMIN_INIT_SECRET" value={secret} onChange={e=>setSecret(e.target.value)} required />
          <input placeholder="admin kullanıcı adı" value={username} onChange={e=>setUsername(e.target.value)} required />
          <input type="password" placeholder="admin şifresi" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button className="btn mt-2">Kur</button>
        </form>
      </div>
    </div>
  )
}
