import { StatsCard } from '@/components/dashboard/stats-card'
import { Ticket, Calendar, DollarSign, Users } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-muted-foreground'>
          Here's an overview of your events and ticket sales.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total Events'
          value='12'
          description='Active events this month'
          icon={Calendar}
        />
        <StatsCard
          title='Tickets Sold'
          value='1,234'
          description='Last 30 days'
          icon={Ticket}
        />
        <StatsCard
          title='Revenue'
          value='$12,345'
          description='Last 30 days'
          icon={DollarSign}
        />
        <StatsCard
          title='Total Attendees'
          value='5,678'
          description='Across all events'
          icon={Users}
        />
      </div>
    </div>
  )
}
