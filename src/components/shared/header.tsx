'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'

export function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className='bg-white shadow'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 justify-between'>
          <div className='flex'>
            <div className='flex flex-shrink-0 items-center'>
              <span className='text-xl font-bold'>Ticketing Platform</span>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              <span className='text-sm text-gray-700'>{user?.email}</span>
            </div>

            <Button
              variant='ghost'
              size='sm'
              onClick={() => signOut()}
              className='text-gray-700'
            >
              <LogOut className='h-5 w-5' />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
