// @@filename: src/app/(dashboard)/events/[id]/edit/loading.tsx
import { DashboardHeader } from '@/components/shared/dashboard-header'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function EditEventLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading='Edit Event'
        text='Make changes to your event details.'
      />
      <div className='grid gap-8'>
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-1/4' />
            <Skeleton className='h-4 w-2/4 mt-2' />
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Title field */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Description field */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-32 w-full' />
            </div>

            {/* Date and Time fields */}
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-16' />
                <Skeleton className='h-10 w-full' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-16' />
                <Skeleton className='h-10 w-full' />
              </div>
            </div>

            {/* Venue field */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Capacity field */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-10 w-full sm:w-1/3' />
            </div>

            {/* Status field */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-10 w-full sm:w-1/4' />
            </div>
          </CardContent>
        </Card>

        {/* Image upload section */}
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-32' />
            <Skeleton className='h-4 w-2/3 mt-2' />
          </CardHeader>
          <CardContent>
            <Skeleton className='h-64 w-full' />
            
            {/* Image previews */}
            <div className='mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className='aspect-square w-full' />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}