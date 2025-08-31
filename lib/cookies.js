import { serialize } from 'cookie'

export function setCookie(res, name, value, options = {}) {
  const cookie = serialize(name, value, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: options.maxAge ?? 60 * 60 * 24 * 7, // 7 days
    ...options
  })
  res.setHeader('Set-Cookie', cookie)
}

export function clearCookie(res, name) {
  const cookie = serialize(name, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0
  })
  res.setHeader('Set-Cookie', cookie)
}
