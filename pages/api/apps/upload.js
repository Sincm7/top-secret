import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { verifyToken } from '../../../lib/jwt'
import formidable from 'formidable'
import fs from 'fs'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  const token = (req.headers.cookie || '').split('; ').find(c=>c.startsWith('ts_session='))?.split('=')[1] || ''
  const user = token ? verifyToken(token) : null
  if (!user) return res.status(401).end()
  if (user.role !== 'admin') return res.status(403).end()

  if (req.method !== 'POST') return res.status(405).end()

  const form = formidable({ multiples: false })
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: 'form parse error' })
    const file = files.file
    if (!file) return res.status(400).json({ error: 'no file' })
    const name = fields.name || file.originalFilename || 'file'
    const description = fields.description || ''
    const status = fields.status || 'downloadable'
    const buf = fs.readFileSync(file.filepath)
    const ext = (file.originalFilename || '').split('.').pop()
    const key = `apps/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext||'bin'}`

    const { data: upload, error: upErr } = await supabaseAdmin
      .storage
      .from('apps')
      .upload(key, buf, { contentType: file.mimetype || 'application/octet-stream', upsert: false })

    if (upErr) return res.status(500).json({ error: upErr.message })

    // generate signed url for download (valid for ~1 year = 31536000 seconds)
    const { data: signed } = await supabaseAdmin
      .storage
      .from('apps')
      .createSignedUrl(key, 31536000)

    const { error: insErr } = await supabaseAdmin.from('apps').insert({
      name, description, status, path: key, size: file.size, uploaded_by: user.id, download_url: signed?.signedUrl || null
    })

    if (insErr) return res.status(500).json({ error: insErr.message })

    res.status(201).json({ ok: true, url: signed?.signedUrl })
  })
}
