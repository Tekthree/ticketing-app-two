// @@filename: src/components/theme/theme-toggle.tsx
'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provider'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  console.log('Current theme:', theme) // Debug log

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={() => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        console.log('Setting theme to:', newTheme) // Debug log
        setTheme(newTheme)
      }}
    >
      <Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
