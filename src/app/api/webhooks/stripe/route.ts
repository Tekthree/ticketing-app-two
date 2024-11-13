import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import Stripe from 'stripe'

const relevantEvents = new Set([
  'checkout.session.completed',
  'payment_intent.succeeded',
])

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return new NextResponse('No signature', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new NextResponse(
      `Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 400 }
    )
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session

          if (session.payment_status === 'paid') {
            const { ticketTypeId, quantity, customerName, eventId } =
              session.metadata || {}

            if (!ticketTypeId || !quantity || !customerName || !eventId) {
              throw new Error('Missing metadata')
            }

            // Create order record
            const { data: order, error: orderError } = await supabaseAdmin
              .from('orders')
              .insert({
                ticket_type_id: ticketTypeId,
                user_id: session.client_reference_id || session.customer_email,
                quantity: parseInt(quantity),
                total_amount: session.amount_total! / 100, // Convert from cents
                payment_status: 'completed',
              })
              .select()
              .single()

            if (orderError) throw orderError

            // Update ticket quantity sold
            const { error: updateError } = await supabaseAdmin.rpc(
              'increment_tickets_sold',
              {
                p_ticket_type_id: ticketTypeId,
                p_quantity: parseInt(quantity),
              }
            )

            if (updateError) throw updateError

            // TODO: Send confirmation email with QR code
            await sendConfirmationEmail({
              orderDetails: order,
              customerEmail: session.customer_email!,
              customerName,
              eventId,
            })
          }
          break

        default:
          throw new Error(`Unhandled relevant event: ${event.type}`)
      }
    } catch (error) {
      console.error('Webhook handler error:', error)
      return new NextResponse(
        'Webhook handler failed. View your Stripe logs for more details.',
        { status: 400 }
      )
    }
  }

  return new NextResponse(null, { status: 200 })
}

async function sendConfirmationEmail({
  orderDetails,
  customerEmail,
  customerName,
  eventId,
}: {
  orderDetails: any
  customerEmail: string
  customerName: string
  eventId: string
}) {
  // TODO: Implement email sending logic
  console.log('Sending confirmation email to:', customerEmail)
}
