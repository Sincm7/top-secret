import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { verifyToken } from '../../../lib/jwt'

export default async function handler(req, res) {
  const cookie = req.headers.cookie || ''
  const token = cookie.split('; ').find(x=>x.startsWith('ts_session='))?.split('=')[1] || ''
  const user = token ? verifyToken(token) : null
  if (!user) return res.status(401).end()

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('id, content, sender_id, sender_name, created_at')
      .order('created_at', { ascending: true })
      .limit(200)
    if (error) return res.status(500).json({ error: error.message })
    res.json(data || [])
  } else if (req.method === 'POST') {
    const { content } = req.body || {}
    if (!content) return res.status(400).json({ error: 'missing content' })
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert({ content, sender_id: user.id, sender_name: user.username })
      .select('id')
      .single()
    if (error) return res.status(500).json({ error: error.message })
    res.status(201).json({ ok: true })
  } else {
    res.status(405).end()
  }
}
