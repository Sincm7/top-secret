'use client'
import { Search } from 'lucide-react'

export function Topbar({ title, right }) {
  return (
    <div className="sticky top-0 z-10 flex h-12 lg:h-14 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 px-3 lg:px-4 backdrop-blur-md">
      <h1 className="text-sm font-medium opacity-90 truncate">{title}</h1>
      <div className="flex items-center gap-2">
        <div className="glass hidden sm:flex items-center gap-2 rounded-xl px-3 py-1.5">
          <Search className="h-4 w-4 opacity-70" />
          <input 
            className="bg-transparent outline-none placeholder:opacity-60 text-sm w-32 lg:w-40" 
            placeholder="Search" 
          />
        </div>
        {right}
      </div>
    </div>
  )
}
