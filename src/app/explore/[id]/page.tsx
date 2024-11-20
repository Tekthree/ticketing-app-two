// @@filename: src/app/explore/[id]/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EventHero } from '@/components/events/event-hero'
import { EventContent } from '@/components/events/event-content'
import { TicketSection } from '@/components/events/ticket-section'
import { VenueSection } from '@/components/events/venue-section'
import { LineupSection } from '@/components/events/lineup-section'
import { RelatedEvents } from '@/components/events/related-events'
import { type Database } from '@/lib/supabase/types'
import { addHours, parseISO } from 'date-fns'

interface PageProps {
  params: Promise<{ id: string }> | { id: string }
}

export default async function EventPage({ params }: PageProps) {
  // Await the params object
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  // First fetch the event
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select(`
      *,
      ticket_types (*),
      event_images (*)
    `)
    .eq('id', id)
    .single()

  if (eventError || !event) {
    console.error('Error fetching event:', eventError)
    notFound()
  }

  // Then fetch the organizer's profile
  const { data: organizer, error: organizerError } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('user_id', event.organizer_id)
    .single()

  if (organizerError) {
    console.error('Error fetching organizer:', organizerError)
    // Don't notFound() here as the event still exists
  }

  // Create lineup data
  const eventDate = parseISO(event.date)
  const lineup = [
    {
      name: event.title,
      time: eventDate,
      imageUrl: event.event_images?.[0]?.url,
    },
    {
      name: 'Opening Act',
      time: addHours(eventDate, -1),
    }
  ]

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background Image & Overlay */}
      {event.event_images?.[0]?.url && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center blur-xl opacity-40"
            style={{ backgroundImage: `url(${event.event_images[0].url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">
        <EventHero
          title={event.title}
          date={new Date(event.date)}
          venue={event.venue}
          image={event.event_images?.[0]?.url}
        />

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <EventContent
                event={event}
                ticketTypes={event.ticket_types}
                organizer={organizer}
              />
              <VenueSection
                venue={event.venue}
                address={event.venue}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <TicketSection
                ticketTypes={event.ticket_types}
                eventId={event.id}
              />
              <LineupSection artists={lineup} />
            </div>
          </div>
        </main>

        {/* Related Events */}
        <section className="bg-zinc-900/50 py-16 mt-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Similar Events</h2>
            <RelatedEvents 
              currentEventId={event.id}
              venueId={event.venue}
            />
          </div>
        </section>
      </div>
    </div>
  )
}