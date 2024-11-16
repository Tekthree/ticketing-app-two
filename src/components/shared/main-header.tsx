// @@filename: src/components/shared/main-header.tsx
'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import Link from 'next/link'
import { LogOut, User } from 'lucide-react'

export function MainHeader() {
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo - Left Side */}
        <Link 
          href="/" 
          className="flex items-center text-xl font-bold hover:opacity-90 transition-opacity"
        >
          Ticketing Platform
        </Link>

        {/* Navigation - Right Side */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-muted-foreground"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Sign out</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}