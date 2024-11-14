// @@filename: src/app/(dashboard)/tickets/loading.tsx

import { DashboardHeader } from '@/components/shared/dashboard-header'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { Card } from '@/components/ui/card'

export default function Loading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading='My Tickets'
        text='View and manage your event tickets.'
      />
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className='p-6 animate-pulse'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <div className='h-5 bg-gray-200 rounded w-3/4' />
                <div className='h-4 bg-gray-200 rounded w-1/2' />
              </div>
              <div className='flex justify-center py-4'>
                <div className='h-32 w-32 bg-gray-200 rounded' />
              </div>
              <div className='space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-1/3 mx-auto' />
                <div className='h-4 bg-gray-200 rounded w-1/4 mx-auto' />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardShell>
  )
}
