// @@filename: src/components/home/featured-events.tsx
import { FeaturedEventCard } from './featured-event-card'

const FEATURED_EVENTS = [
  {
    id: '1',
    title: 'Tech Conference 2024',
    description: 'Join industry leaders for a day of innovation and networking',
    date: '2024-03-15',
    venue: 'San Francisco, CA',
    attendees: 500,
    imageUrl: '/api/placeholder/800/400',
  },
  {
    id: '2',
    title: 'Music Festival',
    description:
      'Experience the best in contemporary music across multiple stages',
    date: '2024-04-20',
    venue: 'Austin, TX',
    attendees: 2000,
    imageUrl: '/api/placeholder/800/400',
  },
  {
    id: '3',
    title: 'Food & Wine Expo',
    description: 'Taste exceptional cuisine and wines from around the world',
    date: '2024-05-05',
    venue: 'New York, NY',
    attendees: 1000,
    imageUrl: '/api/placeholder/800/400',
  },
]

export function FeaturedEvents() {
  return (
    <section className='bg-gray-50 py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h2 className='text-3xl font-bold tracking-tight text-gray-900'>
          Featured Events
        </h2>

        <div className='mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {FEATURED_EVENTS.map(event => (
            <FeaturedEventCard key={event.id} {...event} />
          ))}
        </div>
      </div>
    </section>
  )
}
