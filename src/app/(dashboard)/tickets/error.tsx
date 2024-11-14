// @@filename: src/app/(dashboard)/tickets/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DashboardHeader } from '@/components/shared/dashboard-header'
import { DashboardShell } from '@/components/shared/dashboard-shell'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <DashboardShell>
      <DashboardHeader
        heading='Error'
        text='Something went wrong while loading your tickets.'
      />
      <div className='flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50'>
        <div className='mx-auto flex max-w-[420px] flex-col items-center justify-center text-center'>
          <p className='mb-4 text-sm text-muted-foreground'>
            {error.message || 'Something went wrong. Please try again.'}
          </p>
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </DashboardShell>
  )
}
