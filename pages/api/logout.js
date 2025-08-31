import { clearCookie } from '../../lib/cookies'
export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  clearCookie(res, 'ts_session')
  res.status(200).json({ ok: true })
}
