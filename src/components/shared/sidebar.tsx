// @@filename: src/components/shared/sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { dashboardNav } from '@/config/navigation'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:block">
      <div className="sticky top-16 z-30 -ml-2 h-[calc(100vh-3.5rem)] w-60 overflow-y-auto border-r p-4">
        <ScrollArea className="h-full py-2">
          <nav className="grid items-start gap-2">
            {dashboardNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  pathname === item.href
                    ? 'bg-accent text-accent-foreground'
                    : 'transparent'
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  )
}