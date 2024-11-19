'use client'

// @@filename: src/app/(dashboard)/events/[id]/edit/error.tsx
import { useEffect } from 'react'
import { DashboardHeader } from '@/components/shared/dashboard-header'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <DashboardShell>
      <DashboardHeader
        heading='Error'
        text='An error occurred while loading the event.'
      />
      <div className='grid gap-8'>
        <div className='rounded-md bg-destructive/10 p-6'>
          <div className='flex items-center gap-4'>
            <AlertCircle className='h-6 w-6 text-destructive' />
            <h2 className='text-lg font-semibold'>Something went wrong!</h2>
          </div>
          <p className='mt-2 text-sm text-muted-foreground'>
            {error.message || 'Failed to load event details.'}
          </p>
          <div className='mt-4 flex gap-4'>
            <Button onClick={() => reset()}>Try again</Button>
            <Button variant='outline' onClick={() => window.location.href = '/events'}>
              Go back to events
            </Button>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}