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
import Image from 'next/image'

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
      {/* Top background image section with longer fade */}
      {event.event_images?.[0]?.url && (
        <div 
          className="absolute top-0 left-0 right-0 h-[1200px]"
          style={{
            backgroundImage: `url(${event.event_images[0].url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(40px) brightness(0.4)',
            maskImage: 'linear-gradient(to bottom, black 10%, rgba(0,0,0,0.5) 50%, transparent 90%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 10%, rgba(0,0,0,0.5) 50%, transparent 90%)',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 py-8">
          {/* Left Column - Sticky Image */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-8">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900/50">
                {event.event_images?.[0]?.url && (
                  <Image
                    src={event.event_images[0].url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    width={600}
                    height={450}
                    priority
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Event Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Hero/Title Section - without image */}
            <EventHero
              title={event.title}
              date={new Date(event.date)}
              venue={event.venue}
              image={undefined} // Remove image from hero
            />

            {/* Ticket Section */}
            <TicketSection
              ticketTypes={event.ticket_types}
              eventId={event.id}
            />

            {/* Event Content */}
            <EventContent
              event={event}
              ticketTypes={event.ticket_types}
              organizer={organizer}
            />

            {/* Venue Section */}
            <VenueSection
              venue={event.venue}
              address={event.venue}
            />

            {/* Lineup Section */}
            <LineupSection artists={lineup} />
          </div>
        </div>

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