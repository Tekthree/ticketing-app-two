import { createServerSupabaseClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { ticketTypeId, quantity, customerEmail, customerName } =
      await req.json()

    // Use createServerSupabaseClient instead of createServerClient
    const supabase = await createServerSupabaseClient()

    // Get ticket type details
    const { data: ticketType, error: ticketError } = await supabase
      .from('ticket_types')
      .select(
        `
        *,
        events (
          title,
          venue,
          date
        )
      `
      )
      .eq('id', ticketTypeId)
      .single()

    if (ticketError || !ticketType) {
      return NextResponse.json(
        { error: 'Ticket type not found' },
        { status: 404 }
      )
    }

    // Check if enough tickets are available
    if (ticketType.quantity - ticketType.quantity_sold < quantity) {
      return NextResponse.json(
        { error: 'Not enough tickets available' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${ticketType.name} - ${ticketType.events.title}`,
              description: `Event Date: ${new Date(ticketType.events.date).toLocaleDateString()}
Location: ${ticketType.events.venue}`,
            },
            unit_amount: Math.round(ticketType.price * 100), // Convert to cents
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tickets/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${ticketType.event_id}`,
      customer_email: customerEmail,
      client_reference_id: ticketTypeId,
      metadata: {
        ticketTypeId,
        quantity: quantity.toString(),
        customerName,
        eventId: ticketType.event_id,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
