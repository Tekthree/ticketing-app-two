// @@filename: src/app/(dashboard)/dashboard/page.tsx
'use client'

import { useAnalytics } from '@/hooks/use-analytics'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { EventPerformance } from '@/components/dashboard/event-performance'
import { StatsCard } from '@/components/shared/stats-card'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { DashboardHeader } from '@/components/shared/dashboard-header'
import { Card } from '@/components/ui/card'
import { Loader2, DollarSign, Ticket, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const { data, loading, error } = useAnalytics('month')

  if (loading) {
    return (
      <DashboardShell>
        <div className='flex h-[200px] items-center justify-center'>
          <Loader2 className='h-8 w-8 animate-spin text-gray-400' />
        </div>
      </DashboardShell>
    )
  }

  if (error) {
    return (
      <DashboardShell>
        <div className='text-red-600 p-4 rounded-lg bg-red-50'>
          Error loading dashboard data: {error.message}
        </div>
      </DashboardShell>
    )
  }

  if (!data) {
    return (
      <DashboardShell>
        <div className='text-muted-foreground p-4'>No data available</div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading='Dashboard'
        text='Overview of your events and ticket sales'
      />

      <div className='grid gap-4 md:grid-cols-3'>
        <StatsCard
          title='Total Revenue'
          value={`$${data.totalRevenue.toLocaleString()}`}
          description='Total revenue from all ticket sales'
          icon={DollarSign}
        />
        <StatsCard
          title='Tickets Sold'
          value={data.totalTicketsSold.toLocaleString()}
          description='Total tickets sold across all events'
          icon={Ticket}
        />
        <StatsCard
          title='Active Events'
          value={data.totalEvents.toString()}
          description='Number of upcoming events'
          icon={Calendar}
        />
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4'>
          <div className='p-6'>
            <h3 className='font-medium text-gray-900'>Revenue Over Time</h3>
            <div className='mt-2 h-[300px]'>
              <RevenueChart data={data.revenueByMonth} />
            </div>
          </div>
        </Card>

        <Card className='col-span-3'>
          <div className='p-6'>
            <h3 className='font-medium text-gray-900'>Top Events</h3>
            <div className='mt-2'>
              <EventPerformance data={data.topEvents} />
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  )
}
