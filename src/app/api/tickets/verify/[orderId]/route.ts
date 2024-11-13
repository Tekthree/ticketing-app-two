import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = createServerClient()

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
            venue,
            organizer_id
          )
        )
      `
      )
      .eq('id', params.orderId)
      .single()

    if (error || !order) {
      return new NextResponse(
        JSON.stringify({
          valid: false,
          message: 'Ticket not found',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Check if ticket is for a future event
    const eventDate = new Date(order.ticket_types.events.date)
    const now = new Date()

    if (eventDate < now) {
      return new NextResponse(
        JSON.stringify({
          valid: false,
          message: 'Event has already passed',
          ticket: {
            eventTitle: order.ticket_types.events.title,
            ticketType: order.ticket_types.name,
            quantity: order.quantity,
            eventDate: eventDate.toISOString(),
            venue: order.ticket_types.events.venue,
          },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Get the current user to check if they're the organizer
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const isOrganizer =
      session?.user?.id === order.ticket_types.events.organizer_id

    return new NextResponse(
      JSON.stringify({
        valid: true,
        isOrganizer,
        ticket: {
          eventTitle: order.ticket_types.events.title,
          ticketType: order.ticket_types.name,
          quantity: order.quantity,
          eventDate: eventDate.toISOString(),
          venue: order.ticket_types.events.venue,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error verifying ticket:', error)
    return new NextResponse(
      JSON.stringify({
        valid: false,
        message: 'Error verifying ticket',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
