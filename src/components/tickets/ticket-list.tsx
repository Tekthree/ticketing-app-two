'use client'

import { Card } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { CalendarDays, MapPin, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Order {
  id: string
  quantity: number
  total_amount: number
  payment_status: 'pending' | 'completed' | 'failed'
  created_at: string
  ticket_type_id: {
    id: string
    name: string
    event_id: {
      id: string
      title: string
      date: string
      venue: string
    }
  }
}

interface TicketListProps {
  orders: Order[]
}

export function TicketList({ orders }: TicketListProps) {
  if (!orders?.length) {
    return (
      <Card className='flex min-h-[400px] flex-col items-center justify-center p-8 text-center animate-in fade-in-50'>
        <Ticket className='h-12 w-12 text-muted-foreground' />
        <h3 className='mt-4 text-lg font-semibold'>No tickets found</h3>
        <p className='mb-4 mt-2 text-sm text-muted-foreground'>
          You haven&apos;t purchased any tickets yet. Check out our events page
          to find something interesting!
        </p>
        <Button asChild>
          <Link href='/explore'>Browse Events</Link>
        </Button>
      </Card>
    )
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {orders.map(order => (
        <Card key={order.id} className='flex flex-col p-6'>
          <div className='flex items-start justify-between'>
            <div className='space-y-1'>
              <h3 className='font-semibold'>
                {order.ticket_type_id.event_id.title}
              </h3>
              <div className='flex items-center text-sm text-muted-foreground'>
                <CalendarDays className='mr-1 h-4 w-4' />
                {formatDate(order.ticket_type_id.event_id.date)}
              </div>
              <div className='flex items-center text-sm text-muted-foreground'>
                <MapPin className='mr-1 h-4 w-4' />
                {order.ticket_type_id.event_id.venue}
              </div>
            </div>
            <div
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                order.payment_status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : order.payment_status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }`}
            >
              {order.payment_status.charAt(0).toUpperCase() +
                order.payment_status.slice(1)}
            </div>
          </div>

          <div className='mt-4 flex flex-col space-y-1'>
            <div className='text-sm'>
              <span className='font-medium'>Ticket Type:</span>{' '}
              {order.ticket_type_id.name}
            </div>
            <div className='text-sm'>
              <span className='font-medium'>Quantity:</span> {order.quantity}
            </div>
            <div className='text-sm'>
              <span className='font-medium'>Total Amount:</span> $
              {order.total_amount.toFixed(2)}
            </div>
            <div className='text-xs text-muted-foreground'>
              Purchased on {formatDate(order.created_at)}
            </div>
          </div>

          <div className='mt-4 flex justify-end'>
            <Button asChild variant='outline' size='sm'>
              <Link href={`/tickets/${order.id}`}>View Details</Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
