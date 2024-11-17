// @@filename: src/app/explore/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { EventCard } from '@/components/events/event-card'
import { Button } from '@/components/ui/button'
import { Calendar, Music, PartyPopper, Ticket, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getPublicEvents() {
  const supabase = await createServerSupabaseClient()
  
  const { data: events, error } = await supabase
    .from('events')
    .select(`
      *,
      ticket_types (
        id,
        name,
        price,
        quantity,
        quantity_sold
      ),
      event_images (
        id,
        url,
        alt
      )
    `)
    .eq('status', 'published')
    .gt('date', new Date().toISOString())
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching events:', error)
    throw new Error('Failed to fetch events')
  }

  return events
}

export default async function ExplorePage() {
  const events = await getPublicEvents()

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="py-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Discover Events
        </h1>
        <p className="mt-2 text-muted-foreground">
          Find amazing events happening near you
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          Date
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Music className="h-4 w-4" />
          Shows
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Users className="h-4 w-4" />
          Workshop
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <PartyPopper className="h-4 w-4" />
          Party
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Ticket className="h-4 w-4" />
          Other
        </Button>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h2 className="mt-4 text-lg font-semibold">No events found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Check back later for upcoming events.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map(event => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              date={event.date}
              venue={event.venue}
              price={event.ticket_types?.[0]?.price || 0}
              imageUrl={event.event_images?.[0]?.url}
            />
          ))}
        </div>
      )}
    </div>
  )
}