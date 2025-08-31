import Layout from '../components/Layout'
import { requireAuth } from '../lib/requireAuth'
import { useEffect, useState } from 'react'

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
    return <Layout user={user}><div className="container"><div className="card p-4">Yalnızca yönetici erişebilir.</div></div></Layout>
  }

  return (
    <Layout user={user}>
      <div className="container">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-4">
            <div className="text-lg font-semibold mb-3">Kullanıcılar</div>
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="p-2 rounded border border-zinc-200 dark:border-zinc-700 flex justify-between">
                  <div>{u.username}</div>
                  <div className="text-xs opacity-70">{u.role}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-4">
            <div className="text-lg font-semibold mb-3">Yeni Kullanıcı Ekle</div>
            <form onSubmit={createUser} className="flex flex-col gap-2">
              <input value={username} onChange={e=>setUsername(e.target.value)} required placeholder="kullanıcı adı" />
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="şifre" />
              <select value={role} onChange={e=>setRole(e.target.value)}>
                <option value="member">member</option>
                <option value="admin">admin</option>
              </select>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {ok && <div className="text-green-600 text-sm">{ok}</div>}
              <button className="btn mt-1">Ekle</button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
