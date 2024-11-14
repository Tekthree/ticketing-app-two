// @@filename: src/components/shared/sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { navigation } from '@/config/navigation'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:block w-48 sticky top-16 h-[calc(100vh-4rem)] border-r border-border bg-card">
      <div className="h-full overflow-y-auto">
        <nav className="space-y-1 px-3 py-5">
          {navigation.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-2 h-4 w-4 flex-shrink-0',
                    isActive
                      ? 'text-accent-foreground'
                      : 'text-muted-foreground group-hover:text-accent-foreground'
                  )}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}