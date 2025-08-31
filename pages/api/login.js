import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { signToken } from '../../lib/jwt'
import { setCookie } from '../../lib/cookies'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { username, project, password } = req.body || {}
  if (!username || !project || !password) return res.status(400).json({ error: 'missing fields' })

  if (process.env.NEXT_PUBLIC_PROJECT_NAME && project !== process.env.NEXT_PUBLIC_PROJECT_NAME) {
    return res.status(401).json({ error: 'invalid project' })
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('id, username, password_hash, role')
    .eq('username', username)
    .limit(1)
    .single()

  if (error || !user) return res.status(401).json({ error: 'user not found' })
  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) return res.status(401).json({ error: 'invalid password' })

  const token = signToken({ id: user.id, username: user.username, role: user.role })
  setCookie(res, 'ts_session', token)
  res.status(200).json({ ok: true })
}
