'use client'
import { X } from 'lucide-react'

export function Sidebar({ children, onClose }) {
  return (
    <aside className="glass h-full w-80 lg:w-72 shrink-0 overflow-hidden border-l border-gray-200 dark:border-gray-700 p-3 relative">
      {/* Mobile Close Button */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-3 right-3 glass p-1 rounded-lg hover:shadow-glow transition-all duration-200"
      >
        <X className="h-4 w-4" />
      </button>
      
      {/* Content with top padding for mobile close button */}
      <div className="pt-8 lg:pt-0">
        {children}
      </div>
    </aside>
  )
}
