// @@filename: src/app/events/[id]/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  ChevronLeft,
} from 'lucide-react'
import Link from 'next/link'
import { ImageGallery } from '@/components/events/image-gallery'
import { TicketTypesList } from '@/components/events/ticket-types-list'
import { VenueMap } from '@/components/events/venue-map'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  // Fetch event details
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (!event) {
    notFound()
  }

  // Get organizer profile
  const { data: organizerProfile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('user_id', event.organizer_id)
    .single()

  const { data: ticketTypes } = await supabase
    .from('ticket_types')
    .select('*')
    .eq('event_id', id)
    .order('price')

  const { data: eventImages } = await supabase
    .from('event_images')
    .select('*')
    .eq('event_id', id)

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-4'>
        <Link
          href='/events'
          className='inline-flex items-center text-sm text-muted-foreground hover:text-foreground'
        >
          <ChevronLeft className='mr-1 h-4 w-4' />
          Back to Events
        </Link>
      </div>

      <div className='container mx-auto px-4 py-8'>
        <div className='grid gap-8 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            {eventImages && eventImages.length > 0 && (
              <ImageGallery images={eventImages} />
            )}

            <div className='mt-8 space-y-8'>
              <div>
                <h1 className='text-4xl font-bold'>{event.title}</h1>
                <div className='mt-4 flex flex-wrap gap-4'>
                  <div className='flex items-center text-muted-foreground'>
                    <Calendar className='mr-2 h-5 w-5' />
                    {formatDate(event.date)}
                  </div>
                  <div className='flex items-center text-muted-foreground'>
                    <MapPin className='mr-2 h-5 w-5' />
                    {event.venue}
                  </div>
                  <div className='flex items-center text-muted-foreground'>
                    <Users className='mr-2 h-5 w-5' />
                    {event.capacity} capacity
                  </div>
                </div>
              </div>

              <div>
                <h2 className='text-2xl font-semibold'>About</h2>
                <p className='mt-4 text-muted-foreground'>
                  {event.description}
                </p>
              </div>

              <div>
                <h2 className='text-2xl font-semibold'>Location</h2>
                <div className='mt-4'>
                  <VenueMap
                    venue={event.venue}
                    className='h-[300px] rounded-lg'
                  />
                </div>
              </div>

              <div>
                <h2 className='text-2xl font-semibold'>Organizer</h2>
                <p className='mt-2 text-muted-foreground'>
                  {organizerProfile?.full_name || 'Unknown Organizer'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className='sticky top-4 space-y-6 rounded-lg border bg-card p-6'>
              <div>
                <h2 className='text-xl font-semibold'>Tickets</h2>
                <TicketTypesList ticketTypes={ticketTypes || []} />
              </div>

              <div className='flex items-center justify-between border-t pt-4'>
                <Button variant='outline' size='sm'>
                  <Share2 className='mr-2 h-4 w-4' />
                  Share Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
