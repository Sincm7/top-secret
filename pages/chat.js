import Layout from '../components/Layout'
import { requireAuth } from '../lib/requireAuth'
import { useEffect, useRef, useState } from 'react'

export const getServerSideProps = requireAuth

export default function Chat({ user }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const listRef = useRef(null)

  async function loadMessages() {
    const res = await fetch('/api/messages')
    if (res.ok) {
      const data = await res.json()
      setMessages(data)
    }
  }

  useEffect(() => {
    loadMessages()
    const id = setInterval(loadMessages, 2500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  async function send() {
    const content = text.trim()
    if (!content) return
    setText('')
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
    // reload quickly
    loadMessages()
  }

  return (
    <Layout user={user}>
      <div className="container">
        <div className="card p-4">
          <div className="text-lg font-semibold mb-3">Team Chat</div>
          <div ref={listRef} className="h-[60vh] overflow-y-auto space-y-2 p-2 bg-zinc-50 dark:bg-zinc-800 rounded">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.sender_id===user.id?'justify-end':''}`}>
                <div className={`max-w-[75%] px-3 py-2 rounded-lg ${m.sender_id===user.id?'bg-indigo-600 text-white':'bg-zinc-200 dark:bg-zinc-700'}`}>
                  <div className="text-xs opacity-75">{m.sender_name} · {new Date(m.created_at).toLocaleTimeString()}</div>
                  <div>{m.content}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input className="flex-1" value={text} onChange={e=>setText(e.target.value)} placeholder="Mesaj yaz..." onKeyDown={e=>{ if(e.key==='Enter') send() }} />
            <button className="btn" onClick={send}>Gönder</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
