import React, { useState } from 'react'
import { IconRail } from './IconRail'
import { Topbar } from './Topbar'
import { Menu, X } from 'lucide-react'

export default function AppShell({
  title,
  sidebar,
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative z-10 flex h-screen w-full overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <IconRail />
      
      {/* Sidebar - Hidden on mobile by default */}
      {sidebar && (
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          fixed lg:relative
          top-0 left-0
          z-50 lg:z-auto
          transition-transform duration-300 ease-in-out
        `}>
          {React.cloneElement(sidebar, { onClose: () => setSidebarOpen(false) })}
        </div>
      )}
      
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar 
          title={title} 
          right={
            sidebar && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden glass p-2 rounded-xl hover:shadow-glow transition-all duration-200"
              >
                {sidebarOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>
            )
          }
        />
        <main className="relative min-h-0 flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
