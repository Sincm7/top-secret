import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { verifyToken } from '../../../lib/jwt'

export default async function handler(req, res) {
  const token = (req.headers.cookie || '').split('; ').find(c=>c.startsWith('ts_session='))?.split('=')[1] || ''
  const user = token ? verifyToken(token) : null
  if (!user) return res.status(401).end()

  const { id } = req.query

  if (req.method === 'PATCH') {
    const { status } = req.body || {}
    if (!status) return res.status(400).json({ error: 'missing status' })
    // allow admin or assignee to update
    const { data: t } = await supabaseAdmin.from('tasks').select('assignee_id').eq('id', id).single()
    if (!t) return res.status(404).end()
    if (user.role !== 'admin' && user.id !== t.assignee_id) return res.status(403).end()
    const { error } = await supabaseAdmin.from('tasks').update({ status }).eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    res.json({ ok: true })
  } else {
    res.status(405).end()
  }
}
