import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Layout({ user, children }) {
  const router = useRouter()
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('ts_theme') || 'dark'
    if (saved === 'dark') document.documentElement.classList.add('dark')
    setDark(saved === 'dark')
  }, [])

  function toggleTheme() {
    const nowDark = !dark
    setDark(nowDark)
    if (nowDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('ts_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('ts_theme', 'light')
    }
  }

  async function logout() {
    await fetch('/api/logout', { method: 'POST' })
    router.replace('/login')
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 hidden md:flex flex-col gap-2 p-4 bg-zinc-100/80 dark:bg-zinc-900/60 border-r border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 mb-2">
          <img src="/logo.svg" className="w-8 h-8" alt="logo" />
          <div className="font-semibold">Top Secret</div>
        </div>
        <nav className="flex flex-col gap-1">
          <Link className={`px-3 py-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 ${router.pathname==='/chat'?'bg-zinc-200 dark:bg-zinc-800':''}`} href="/chat">Chat</Link>
          <Link className={`px-3 py-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 ${router.pathname==='/tasks'?'bg-zinc-200 dark:bg-zinc-800':''}`} href="/tasks">Tasks</Link>
          <Link className={`px-3 py-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 ${router.pathname==='/apps'?'bg-zinc-200 dark:bg-zinc-800':''}`} href="/apps">Apps</Link>
          {user?.role === 'admin' && (
            <Link className={`px-3 py-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 ${router.pathname==='/admin'?'bg-zinc-200 dark:bg-zinc-800':''}`} href="/admin">Admin</Link>
          )}
        </nav>
        <div className="mt-auto flex items-center gap-2">
          <button className="btn-secondary" onClick={toggleTheme}>{dark ? '☀️ Light' : '🌙 Dark'}</button>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
      </aside>
      <main className="flex-1 p-3 md:p-6">
        <div className="md:hidden flex justify-between mb-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" className="w-8 h-8" alt="logo" />
            <span className="font-semibold">Top Secret</span>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={toggleTheme}>{dark ? '☀️' : '🌙'}</button>
            <button className="btn" onClick={logout}>Logout</button>
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}
