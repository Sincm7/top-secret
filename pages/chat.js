import AppShell from '../components/shell/AppShell'
import { Sidebar } from '../components/shell/Sidebar'
import { requireAuth } from '../lib/requireAuth'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Hash, MessageCircle } from 'lucide-react'

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

  // TODO(aurora-refactor): Discord benzeri chat sidebar - kanallar ve DM'ler
  const sidebarContent = (
    <Sidebar>
      <div className="space-y-4">
        {/* Channels Section */}
        <div>
          <div className="mb-2 text-xs font-medium opacity-70 uppercase tracking-wider">Channels</div>
          <div className="space-y-1">
            {['general', 'random', 'help'].map(channel => (
              <motion.div
                key={channel}
                whileHover={{ x: 2 }}
                className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-white/5 cursor-pointer"
              >
                <Hash className="h-4 w-4 opacity-60" />
                <span className="opacity-80 group-hover:opacity-100">#{channel}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Direct Messages */}
        <div>
          <div className="mb-2 text-xs font-medium opacity-70 uppercase tracking-wider">Direct Messages</div>
          <div className="space-y-1">
            {['@mert', '@sinan', '@admin'].map(dm => (
              <motion.div
                key={dm}
                whileHover={{ x: 2 }}
                className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-white/5 cursor-pointer"
              >
                <MessageCircle className="h-4 w-4 opacity-60" />
                <span className="opacity-80 group-hover:opacity-100">{dm}</span>
                <div className="ml-auto h-2 w-2 rounded-full bg-brand-3 opacity-0 group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Sidebar>
  )

  return (
    <AppShell title="Chat" sidebar={sidebarContent}>
      <div className="flex flex-col h-full">
        {/* Message Groups - Scrollable area */}
        <div 
          ref={listRef} 
          className="flex-1 overflow-y-auto space-y-4 pb-4"
          style={{ height: 'calc(100vh - 200px)' }}
        >
          {messages.map(m => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`group relative ${m.sender_id === user.id ? 'text-right' : ''}`}
            >
              <div className={`glass rounded-2xl p-3 lg:p-4 transition hover:shadow-glow ${
                m.sender_id === user.id ? 'ml-auto max-w-[85%] lg:max-w-[75%]' : 'mr-auto max-w-[85%] lg:max-w-[75%]'
              }`}>
                <div className="mb-1 text-xs opacity-70">
                  {m.sender_name} • {new Date(m.created_at).toLocaleTimeString()}
                </div>
                <div className="text-sm leading-relaxed">{m.content}</div>
                
                {/* Hover Actions */}
                <div className="pointer-events-none absolute right-2 top-2 opacity-0 transition group-hover:opacity-100">
                  <div className="glass rounded-lg px-2 py-1 text-xs">⋯</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Composer - Fixed at bottom */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-3 lg:p-4 mt-4"
        >
          <div className="flex items-center gap-2">
            <input 
              className="flex-1 rounded-xl bg-transparent px-3 py-2 outline-none placeholder:opacity-60 text-sm" 
              placeholder="Mesaj yaz…" 
              value={text} 
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if(e.key === 'Enter') send() }}
            />
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={send}
              className="rounded-xl bg-brand-1 px-3 lg:px-4 py-2 text-sm font-medium text-white transition hover:shadow-glow"
            >
              Gönder
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}
