import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { verifyToken } from '../../../lib/jwt'

export default async function handler(req, res) {
  const token = (req.headers.cookie || '').split('; ').find(c=>c.startsWith('ts_session='))?.split('=')[1] || ''
  const user = token ? verifyToken(token) : null
  if (!user) return res.status(401).end()

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('users').select('id, username, role').order('username', { ascending: true })
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
  } else if (req.method === 'POST') {
    if (user.role !== 'admin') return res.status(403).end()
    const { username, password, role } = req.body || {}
    if (!username || !password) return res.status(400).json({ error: 'missing' })
    const bcrypt = (await import('bcryptjs')).default
    const hash = await bcrypt.hash(password, 10)
    const { data, error } = await supabaseAdmin.from('users').insert({ username, password_hash: hash, role: role || 'member' })
    if (error) return res.status(500).json({ error: error.message })
    res.status(201).json({ ok: true })
  } else {
    res.status(405).end()
  }
}
