import { createServerClient } from '@/lib/supabase/server'
import { Calendar, MapPin } from 'lucide-react'
import { QRCode } from '@/components/tickets/qr-code'
import Link from 'next/link'

export default async function TicketsPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const { data: orders } = await supabase
    .from('orders')
    .select(
      `
      *,
      ticket_types (
        name,
        events (
          id,
          title,
          date,
          venue
        )
      )
    `
    )
    .eq('user_id', session.user.id)
    .eq('payment_status', 'completed')
    .order('created_at', { ascending: false })

  if (!orders?.length) {
    return (
      <div className='text-center'>
        <h3 className='mt-2 text-sm font-semibold text-gray-900'>
          No tickets yet
        </h3>
        <p className='mt-1 text-sm text-gray-500'>
          Get started by purchasing tickets to an event.
        </p>
        <div className='mt-6'>
          <Link
            href='/events'
            className='inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90'
          >
            Browse Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>My Tickets</h1>
        <p className='text-muted-foreground'>
          View and manage your tickets for upcoming events
        </p>
      </div>

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {orders.map(order => {
          const event = order.ticket_types.events
          const ticketType = order.ticket_types

          return (
            <div
              key={order.id}
              className='bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200'
            >
              <div className='px-4 py-5 sm:p-6'>
                <h3 className='text-lg font-medium text-gray-900 truncate'>
                  {event.title}
                </h3>

                <div className='mt-4 space-y-2'>
                  <div className='flex items-center text-sm text-gray-500'>
                    <Calendar className='mr-2 h-4 w-4' />
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>

                  <div className='flex items-center text-sm text-gray-500'>
                    <MapPin className='mr-2 h-4 w-4' />
                    {event.venue}
                  </div>
                </div>

                <div className='mt-4'>
                  <p className='text-sm text-gray-900'>
                    {ticketType.name} × {order.quantity}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Order #{order.id.slice(0, 8)}
                  </p>
                </div>

                <div className='mt-4 flex justify-center'>
                  <QRCode
                    value={`${process.env.NEXT_PUBLIC_APP_URL}/api/tickets/verify/${order.id}`}
                    size={150}
                  />
                </div>
              </div>

              <div className='px-4 py-4 sm:px-6'>
                <Link
                  href={`/events/${event.id}`}
                  className='text-primary hover:text-primary/90 text-sm font-medium'
                >
                  View Event Details
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
