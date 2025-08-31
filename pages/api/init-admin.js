import { supabaseAdmin } from '../../lib/supabaseAdmin'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { secret, username, password } = req.body || {}
  if (!secret || secret !== process.env.ADMIN_INIT_SECRET) return res.status(401).json({ error: 'invalid secret' })

  // check if any user exists
  const { data: countData, error: cErr } = await supabaseAdmin.rpc('count_users')
  if (cErr) return res.status(500).json({ error: 'db error' })
  if ((countData?.count || 0) > 0) return res.status(400).json({ error: 'already initialized' })

  const hash = await bcrypt.hash(password, 10)
  const { data, error } = await supabaseAdmin.from('users').insert({ username, password_hash: hash, role: 'admin' }).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ ok: true, user: { id: data.id, username: data.username } })
}
