// @@filename: src/components/shared/header.tsx
'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { MobileNav } from './mobile-nav'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import Link from 'next/link'

export function Header() {
  const { user, signOut } = useAuth()

  return (
    <div className="sticky top-0 z-50">
      <header className="h-16 border-b bg-card border-border">
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <MobileNav />
            <Link 
              href="/" 
              className="flex items-center text-xl font-bold text-card-foreground hover:opacity-90 transition-opacity"
            >
              Ticketing Platform
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>

            <ThemeToggle />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-muted-foreground"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        </div>
      </header>
    </div>
  )
}