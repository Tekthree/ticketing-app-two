// @@filename: src/components/shared/mobile-nav.tsx
'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as Dialog from '@radix-ui/react-dialog'
import { navigation } from '@/config/navigation' // Fixed import path

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant='ghost' className='md:hidden' size='icon'>
          <Menu className='h-5 w-5' />
          <span className='sr-only'>Toggle menu</span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 z-50 bg-black/50' />
        <Dialog.Content className='fixed inset-y-0 left-0 z-50 h-full w-3/4 max-w-sm bg-white'>
          <div className='flex h-full flex-col'>
            <div className='flex h-16 items-center justify-between border-b px-4'>
              <span className='text-lg font-semibold'>Menu</span>
              <Dialog.Close asChild>
                <Button variant='ghost' size='icon'>
                  <X className='h-5 w-5' />
                  <span className='sr-only'>Close menu</span>
                </Button>
              </Dialog.Close>
            </div>
            <nav className='flex-1 overflow-y-auto p-4'>
              <div className='space-y-2'>
                {navigation.map(item => {
                  const isActive = pathname === item.href
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center rounded-md px-2 py-2 text-sm font-medium',
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon
                        className={cn(
                          'mr-3 h-5 w-5',
                          isActive
                            ? 'text-gray-900'
                            : 'text-gray-400 group-hover:text-gray-500'
                        )}
                      />
                      {item.name}
                    </a>
                  )
                })}
              </div>
            </nav>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
