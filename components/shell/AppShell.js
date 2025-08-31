import { IconRail } from './IconRail'
import { Topbar } from './Topbar'

export default function AppShell({
  title,
  sidebar,
  children,
}) {
  return (
    <div className="relative z-10 flex h-screen w-full overflow-hidden">
      <IconRail />
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main className="relative min-h-0 flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
