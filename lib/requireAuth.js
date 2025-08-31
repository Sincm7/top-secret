import { verifyToken } from './jwt'
import { parse } from 'cookie'

export async function requireAuth(ctx) {
  const { req, res } = ctx
  const parsed = parse(req.headers.cookie || '')
  const token = parsed['ts_session']
  const payload = token ? verifyToken(token) : null
  if (!payload) {
    return {
      redirect: { destination: '/login', permanent: false }
    }
  }
  return { props: { user: payload } }
}
