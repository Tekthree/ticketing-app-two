// @@filename: src/components/home/featured-events.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { FeaturedEventCard } from './featured-event-card'

export async function FeaturedEvents() {
  const supabase = await createServerSupabaseClient()

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('date', { ascending: true })
    .limit(6)

  if (!events?.length) {
    return (
      <section className='bg-muted py-16'>
        <div className='container'>
          <h2 className='text-3xl font-bold'>No events found</h2>
        </div>
      </section>
    )
  }

  return (
    <section className='bg-muted py-16'>
      <div className='container'>
        <h2 className='text-3xl font-bold'>Featured Events</h2>

        <div className='mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {events.map(event => (
            <FeaturedEventCard
              key={event.id}
              id={event.id}
              title={event.title}
              description={event.description || ''}
              date={event.date}
              venue={event.venue}
              capacity={event.capacity}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
