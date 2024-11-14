import { createServerSupabaseClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'
import { CheckCircle2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Props {
  searchParams: { session_id: string }
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const sessionId = searchParams.session_id

  if (!sessionId) {
    notFound()
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (!session) {
    notFound()
  }

  const supabase = createServerSupabaseClient()

 const { data: order, error } = await supabase
   .from('orders')
   .select(
     `
    *,
    ticket_types (
      name,
      events (
        title,
        date,
        venue
      )
    )
  `
   )
   .eq('payment_status', 'completed')
   .order('created_at', { ascending: false })
   .limit(1)
   .single()

 if (error) {
   console.error('Error fetching order:', error)
   // Handle the error, e.g., show an error message or redirect to an error page
   return <div>An error occurred while fetching the order.</div>
 }

 if (!order) {
   // Handle the case when the order is not found
   return <div>Order not found.</div>
 }

  const event = order.ticket_types.events
  const ticketType = order.ticket_types

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8'>
      <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 max-w-2xl w-full'>
        <div className='text-center'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
            <CheckCircle2 className='h-6 w-6 text-green-600' />
          </div>

          <h2 className='mt-4 text-2xl font-bold text-gray-900'>
            Order Confirmed!
          </h2>

          <p className='mt-2 text-sm text-gray-600'>
            Thank you for your purchase. Your tickets have been confirmed.
          </p>
        </div>

        <div className='mt-8 border-t border-gray-200 pt-8'>
          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-medium text-gray-900'>
                Event Details
              </h3>
              <div className='mt-3 space-y-2'>
                <p className='text-gray-900'>{event.title}</p>
                <p className='text-gray-600'>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
                <p className='text-gray-600'>{event.venue}</p>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-medium text-gray-900'>
                Order Summary
              </h3>
              <div className='mt-3 space-y-2'>
                <div className='flex justify-between'>
                  <p className='text-gray-600'>
                    {ticketType.name} × {order.quantity}
                  </p>
                  <p className='text-gray-900'>
                    ${order.total_amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-medium text-gray-900'>
                What's Next?
              </h3>
              <p className='mt-2 text-gray-600'>
                We've sent a confirmation email with your tickets and QR codes.
                Please bring these with you to the event.
              </p>
            </div>
          </div>
        </div>

        <div className='mt-8 flex gap-4 justify-center'>
          <Button asChild>
            <Link href='/tickets'>View My Tickets</Link>
          </Button>
          <Button asChild variant='outline'>
            <Link href='/events'>Browse More Events</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
