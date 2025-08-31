import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { verifyToken } from '../../../lib/jwt'

export default async function handler(req, res) {
  const token = (req.headers.cookie || '').split('; ').find(c=>c.startsWith('ts_session='))?.split('=')[1] || ''
  const user = token ? verifyToken(token) : null
  if (!user) return res.status(401).end()

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('apps').select('*').order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    res.json(data || [])
  } else {
    res.status(405).end()
  }
}
