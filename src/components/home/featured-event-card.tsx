// @@filename: src/components/home/featured-event-card.tsx
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users } from 'lucide-react'
import Link from 'next/link'

interface FeaturedEventCardProps {
  id: string
  title: string
  description: string
  date: string
  venue: string
  attendees: number
  imageUrl: string
}

export function FeaturedEventCard({
  id,
  title,
  description,
  date,
  venue,
  attendees,
  imageUrl,
}: FeaturedEventCardProps) {
  return (
    <div className='group relative flex h-full flex-col overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg'>
      {/* Event Image */}
      <div className='relative h-48 overflow-hidden'>
        <div
          className='absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105'
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
      </div>

      {/* Content */}
      <div className='flex flex-1 flex-col p-6'>
        <h3 className='text-xl font-semibold text-gray-900'>{title}</h3>
        <p className='mt-2 flex-1 text-sm text-gray-500 line-clamp-2'>
          {description}
        </p>

        <div className='mt-4 space-y-2'>
          <div className='flex items-center text-sm text-gray-600'>
            <Calendar className='mr-2 h-4 w-4' />
            {new Date(date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>

          <div className='flex items-center text-sm text-gray-600'>
            <MapPin className='mr-2 h-4 w-4' />
            {venue}
          </div>

          <div className='flex items-center text-sm text-gray-600'>
            <Users className='mr-2 h-4 w-4' />
            {attendees} attendees
          </div>
        </div>

        <Button asChild className='mt-6 w-full'>
          <Link href={`/events/${id}`}>Get Tickets</Link>
        </Button>
      </div>
    </div>
  )
}
