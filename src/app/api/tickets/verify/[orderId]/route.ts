import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    // Use createServerSupabaseClient instead of createServerClient
    const supabase = await createServerSupabaseClient()

    // Fetch the order with related data
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
      return NextResponse.json(
        {
          valid: false,
          message: 'Ticket not found',
        },
        { status: 404 }
      )
    }

    // Check if ticket is for a future event
    const eventDate = new Date(order.ticket_types.events.date)
    const now = new Date()

    if (eventDate < now) {
      return NextResponse.json(
        {
          valid: false,
          message: 'Event has already passed',
          ticket: {
            eventTitle: order.ticket_types.events.title,
            ticketType: order.ticket_types.name,
            quantity: order.quantity,
            eventDate: eventDate.toISOString(),
            venue: order.ticket_types.events.venue,
          },
        },
        { status: 200 }
      )
    }

    // Get the current user to check if they're the organizer
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const isOrganizer = user?.id === order.ticket_types.events.organizer_id

    return NextResponse.json(
      {
        valid: true,
        isOrganizer,
        ticket: {
          eventTitle: order.ticket_types.events.title,
          ticketType: order.ticket_types.name,
          quantity: order.quantity,
          eventDate: eventDate.toISOString(),
          venue: order.ticket_types.events.venue,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error verifying ticket:', error)
    return NextResponse.json(
      {
        valid: false,
        message: 'Error verifying ticket',
      },
      { status: 500 }
    )
  }
}
