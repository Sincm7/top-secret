'use client'

export function Sidebar({ children }) {
  return (
    <aside className="glass h-full w-72 shrink-0 overflow-hidden border-l border-gray-200 dark:border-gray-700 p-3">
      {children}
    </aside>
  )
}
