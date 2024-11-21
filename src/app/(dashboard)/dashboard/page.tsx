// @@filename: src/app/(dashboard)/dashboard/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { DashboardHeader } from '@/components/shared/dashboard-header'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Calendar, Ticket, DollarSign } from 'lucide-react'
import { redirect } from 'next/navigation'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

async function getDashboardData() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Fetch all events created by the user
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select(
      `
      *,
      ticket_types (
        id,
        name,
        price,
        quantity,
        quantity_sold
      )
    `
    )
    .eq('organizer_id', user.id)
    .order('created_at', { ascending: false })

  if (eventsError) {
    console.error('Error fetching events:', eventsError)
    throw new Error('Failed to fetch events')
  }

  // Get total sales data from orders
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select(
      `
      *,
      ticket_types!inner (
        event_id,
        events!inner (
          organizer_id
        )
      )
    `
    )
    .eq('ticket_types.events.organizer_id', user.id)
    .eq('payment_status', 'completed')

  if (ordersError) {
    console.error('Error fetching orders:', ordersError)
    throw new Error('Failed to fetch orders')
  }

  // Calculate stats
  const totalTicketsSold =
    orders?.reduce((sum, order) => sum + order.quantity, 0) || 0
  const totalRevenue =
    orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0
  const totalEvents = events?.length || 0
  const publishedEvents =
    events?.filter(e => e.status === 'published').length || 0
  const upcomingEvents =
    events?.filter(e => new Date(e.date) > new Date()).length || 0

  return {
    events,
    stats: {
      totalEvents,
      publishedEvents,
      upcomingEvents,
      totalTicketsSold,
      totalRevenue,
    },
  }
}

export default async function DashboardPage() {
  const { events, stats } = await getDashboardData()

  return (
    <DashboardShell>
      <DashboardHeader
        heading='Dashboard'
        text='Overview of your events and ticket sales'
      >
        <Button asChild>
          <Link href='/events/new'>
            <Plus className='mr-2 h-4 w-4' />
            Create Event
          </Link>
        </Button>
      </DashboardHeader>

      {/* Stats Overview */}
      <div className='grid gap-4 md:grid-cols-3'>
        <Card className='p-6'>
          <div className='flex items-center gap-2'>
            <Calendar className='h-5 w-5 text-muted-foreground' />
            <h3 className='font-medium'>Total Events</h3>
          </div>
          <p className='mt-2 text-2xl font-bold'>{stats.totalEvents}</p>
          <p className='text-sm text-muted-foreground'>
            {stats.publishedEvents} published · {stats.upcomingEvents} upcoming
          </p>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center gap-2'>
            <Ticket className='h-5 w-5 text-muted-foreground' />
            <h3 className='font-medium'>Tickets Sold</h3>
          </div>
          <p className='mt-2 text-2xl font-bold'>{stats.totalTicketsSold}</p>
          <p className='text-sm text-muted-foreground'>Across all events</p>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center gap-2'>
            <DollarSign className='h-5 w-5 text-muted-foreground' />
            <h3 className='font-medium'>Revenue</h3>
          </div>
          <p className='mt-2 text-2xl font-bold'>
            {formatCurrency(stats.totalRevenue)}
          </p>
          <p className='text-sm text-muted-foreground'>Total earnings</p>
        </Card>
      </div>

      {/* Recent Events */}
      <div className='space-y-4'>
        <h2 className='text-xl font-semibold'>Recent Events</h2>

        {events.length === 0 ? (
          <Card className='p-12 text-center'>
            <h3 className='font-semibold text-lg'>No events found</h3>
            <p className='mt-2 text-sm text-muted-foreground'>
              Get started by creating your first event.
            </p>
            <Button asChild className='mt-6'>
              <Link href='/events/new'>Create Event</Link>
            </Button>
          </Card>
        ) : (
          <div className='grid gap-4'>
            {events.map(event => (
              <Card key={event.id} className='p-6'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-semibold'>{event.title}</h3>
                      <Badge
                        variant={
                          event.status === 'published'
                            ? 'default'
                            : event.status === 'draft'
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {formatDate(event.date)} · {event.venue}
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <Button asChild variant='ghost' size='sm'>
                      <Link href={`/events/${event.id}`}>
                        View Analytics
                      </Link>
                    </Button>
                    <Button asChild variant='ghost' size='sm'>
                      <Link href={`/events/${event.id}/edit`}>Edit Event</Link>
                    </Button>
                    <Button asChild size='sm'>
                      <Link href={`/explore/${event.id}`} target='_blank'>
                        Preview
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className='mt-4 grid grid-cols-3 gap-4'>
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>
                      Ticket Types
                    </p>
                    <p className='text-lg font-medium'>
                      {event.ticket_types?.length || 0}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>
                      Tickets Sold
                    </p>
                    <p className='text-lg font-medium'>
                      {event.ticket_types?.reduce(
                        (sum, type) => sum + (type.quantity_sold || 0),
                        0
                      ) || 0}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>Revenue</p>
                    <p className='text-lg font-medium'>
                      {formatCurrency(
                        event.ticket_types?.reduce(
                          (sum, type) =>
                            sum + type.price * (type.quantity_sold || 0),
                          0
                        ) || 0
                      )}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
