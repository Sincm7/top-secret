'use client'
import { MessageSquare, CheckSquare, Grid, Shield, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const items = [
  { href: '/chat', icon: MessageSquare, label: 'Chat' },
  { href: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { href: '/apps', icon: Grid, label: 'Apps' },
  { href: '/admin', icon: Shield, label: 'Admin' },
]

export function IconRail() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-full w-12 lg:w-16 flex-col items-center gap-2 lg:gap-3 border-r border-gray-200 dark:border-gray-700 py-2 lg:py-3">
        {items.map(({ href, icon: Icon, label }) => (
          <div key={href} className="glass flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl lg:rounded-2xl">
            <Icon className="h-4 w-4 lg:h-5 lg:w-5 opacity-80" />
          </div>
        ))}
        <div className="mt-auto">
          <div className="glass flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl lg:rounded-2xl">
            <Sun className="h-4 w-4 lg:h-5 lg:w-5 opacity-80" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-12 lg:w-16 flex-col items-center gap-2 lg:gap-3 border-r border-gray-200 dark:border-gray-700 py-2 lg:py-3">
      {items.map(({ href, icon: Icon, label }) => {
        const active = router.pathname?.startsWith(href)
        return (
          <Link key={href} href={href} className="group relative">
            <div
              className={`glass flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl lg:rounded-2xl transition-all duration-200 hover:scale-105 ${
                active ? 'ring-1 ring-blue-500/20 shadow-glow' : ''
              }`}
            >
              <Icon className={`h-4 w-4 lg:h-5 lg:w-5 ${
                active ? '' : 'opacity-80 group-hover:opacity-100'
              }`} />
            </div>
            <span className="pointer-events-none absolute left-12 lg:left-14 top-1/2 -translate-y-1/2 rounded-xl bg-black/70 px-2 py-1 text-xs text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100">
              {label}
            </span>
          </Link>
        )
      })}
      
      {/* Theme Toggle */}
      <div className="mt-auto">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="glass flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl lg:rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-glow"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 lg:h-5 lg:w-5 opacity-80 hover:opacity-100" />
          ) : (
            <Moon className="h-4 w-4 lg:h-5 lg:w-5 opacity-80 hover:opacity-100" />
          )}
        </button>
      </div>
    </div>
  )
}
