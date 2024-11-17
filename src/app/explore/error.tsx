// @@filename: src/app/explore/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <h2 className="mt-4 text-lg font-semibold">
          Something went wrong!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || 'Failed to load events. Please try again.'}
        </p>
        <Button
          onClick={reset}
          variant="outline"
          className="mt-4 gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      </div>
    </div>
  )
}