import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { verifyToken } from '../../../lib/jwt'

export default async function handler(req, res) {
  const token = (req.headers.cookie || '').split('; ').find(c=>c.startsWith('ts_session='))?.split('=')[1] || ''
  const user = token ? verifyToken(token) : null
  if (!user) return res.status(401).end()

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .select('id, title, description, status, assignee_id, assignee_name')
      .order('created_at', { ascending: false })
      .limit(200)
    if (error) return res.status(500).json({ error: error.message })
    res.json(data || [])
  } else if (req.method === 'POST') {
    if (user.role !== 'admin') return res.status(403).end()
    const { title, description, assignee_id } = req.body || {}
    if (!title || !assignee_id) return res.status(400).json({ error: 'missing' })
    // look up assignee name
    const { data: u } = await supabaseAdmin.from('users').select('username').eq('id', assignee_id).single()
    const { error } = await supabaseAdmin.from('tasks').insert({
      title, description: description || '', status: 'not_started', assignee_id, assignee_name: u?.username || null, created_by: user.id
    })
    if (error) return res.status(500).json({ error: error.message })
    res.status(201).json({ ok: true })
  } else {
    res.status(405).end()
  }
}
