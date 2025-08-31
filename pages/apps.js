import Layout from '../components/Layout'
import { requireAuth } from '../lib/requireAuth'
import { useEffect, useState } from 'react'

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

  return (
    <Layout user={user}>
      <div className="container">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 card p-4">
            <div className="text-lg font-semibold mb-3">Uygulamalar</div>
            <div className="space-y-2">
              {apps.map(a => (
                <div key={a.id} className="p-3 rounded border border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-sm opacity-75">{a.description}</div>
                    <div className="text-xs opacity-60 mt-1">Durum: {a.status} · Boyut: {Math.round((a.size||0)/1024)} KB</div>
                  </div>
                  {a.download_url && <a className="btn" href={a.download_url} target="_blank" rel="noreferrer">İndir</a>}
                </div>
              ))}
            </div>
          </div>
          <div className="card p-4">
            <div className="text-lg font-semibold mb-3">Yeni Uygulama (Yönetici)</div>
            {user.role !== 'admin' ? (
              <div className="text-sm opacity-70">Sadece yönetici yükleyebilir.</div>
            ) : (
              <form onSubmit={upload} className="flex flex-col gap-2">
                <input value={name} onChange={e=>setName(e.target.value)} required placeholder="Uygulama adı" />
                <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Açıklama" />
                <select value={status} onChange={e=>setStatus(e.target.value)}>
                  <option value="development">development</option>
                  <option value="update">update</option>
                  <option value="downloadable">downloadable</option>
                </select>
                <input type="file" onChange={e=>setFile(e.target.files[0])} accept=".py,.exe,.zip,.txt,.pdf,.png,.jpg" />
                {msg && <div className="text-sm">{msg}</div>}
                <button className="btn mt-1">Yükle</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
