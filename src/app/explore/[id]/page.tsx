// @@filename: src/app/explore/[id]/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EventHero from '@/components/events/event-hero'
import EventContent from '@/components/events/event-content'
import RelatedEvents from '@/components/events/related-events'
import { AppFooter } from '@/components/layout/app-footer'

interface PageProps {
  params: Promise<{ id: string }> | { id: string }
}

export default async function EventPage({ params }: PageProps) {
  // Await the params object
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  // Fetch event with related data
  const { data: event, error } = await supabase
    .from('events')
    .select(
      `
      *,
      ticket_types (*),
      event_images (*)
    `
    )
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  // Get organizer profile
  const { data: organizer } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('user_id', event.organizer_id)
    .single()

  // Format event date
  const eventDate = new Date(event.date)

  return (
    <>
      <div className='relative min-h-screen'>
        <EventHero
          title={event.title}
          date={eventDate}
          venue={event.venue}
          image={event.event_images?.[0]?.url}
        />

        <EventContent
          event={event}
          organizer={organizer}
          ticketTypes={event.ticket_types}
        />

        <div className='relative z-10 mt-8 bg-background'>
          <RelatedEvents currentEventId={event.id} venueId={event.venue} />
        </div>
      </div>

      <AppFooter />
    </>
  )
}
