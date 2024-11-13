import { createServerClient } from '@/lib/supabase/server'
import { TicketTypesSection } from '@/components/tickets/ticket-types-section'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, Edit } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface EventDetailsPageProps {
  params: {
    id: string
  }
}

export default async function EventDetailsPage({
  params,
}: EventDetailsPageProps) {
  const supabase = createServerClient()

  // Fetch event details
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select(
      `
      *,
      profiles:organizer_id (
        full_name
      )
    `
    )
    .eq('id', params.id)
    .single()

  if (eventError || !event) {
    notFound()
  }

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const isOrganizer = session?.user?.id === event.organizer_id

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='flex items-center gap-4'>
            <h1 className='text-2xl font-bold tracking-tight'>{event.title}</h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                event.status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : event.status === 'draft'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-100 text-red-800'
              }`}
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
          <p className='text-muted-foreground'>
            Organized by {event.profiles.full_name}
          </p>
        </div>

        {isOrganizer && (
          <Button asChild>
            <Link href={`/events/${event.id}/edit`}>
              <Edit className='mr-2 h-4 w-4' />
              Edit Event
            </Link>
          </Button>
        )}
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <div className='space-y-6'>
          <div>
            <h2 className='text-lg font-semibold'>About</h2>
            <p className='mt-2 text-gray-600'>{event.description}</p>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center text-gray-600'>
              <Calendar className='mr-2 h-5 w-5' />
              {new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </div>

            <div className='flex items-center text-gray-600'>
              <MapPin className='mr-2 h-5 w-5' />
              {event.venue}
            </div>

            <div className='flex items-center text-gray-600'>
              <Users className='mr-2 h-5 w-5' />
              {event.capacity} attendees maximum
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <TicketTypesSection eventId={event.id} isOrganizer={isOrganizer} />
        </div>
      </div>
    </div>
  )
}
