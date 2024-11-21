// @@filename: src/app/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/home/hero-section'
import { TrendingSection } from '@/components/home/trending-section'
import { VenueScroll } from '@/components/home/venue-scroll'

const VENUES = [
  'Brooklyn Mirage',
  'Rough Trade',
  'Knockdown Center',
  'Elsewhere',
  'House of Yes',
  'Superior Ingredients',
  'Good Room',
  'Brooklyn Steel',
]

async function getTrendingEvents() {
  const supabase = await createServerSupabaseClient()

  const { data: events, error } = await supabase
    .from('events')
    .select(
      `
      *,
      ticket_types (*),
      event_images (*)
    `
    )
    .eq('status', 'published')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(10)

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return events
}

export default async function HomePage() {
  const events = await getTrendingEvents()

  return (
    <main className='min-h-screen bg-background'>
      <HeroSection />
   
      <TrendingSection events={events} />
    </main>
  )
}
