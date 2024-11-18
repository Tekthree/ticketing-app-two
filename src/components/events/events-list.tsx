// @@filename: src/components/events/events-list.tsx
'use client'

import { useState, useEffect } from 'react'
import { useEvents } from '@/hooks/use-events'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/auth-provider'
import { Card } from '@/components/ui/card'
import {
  Calendar,
  MapPin,
  Users,
  Edit,
  Trash2,
  Eye,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

export function EventsList() {
  const { events, loading, error } = useEvents()
  const { user } = useAuth()
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  // Add debug logs
  console.log('EventsList Render:', {
    user: user?.id,
    loading,
    eventsCount: events?.length,
    events,
    error
  })

  useEffect(() => {
    console.log('Events Data Changed:', {
      timestamp: new Date().toISOString(),
      events,
      loading,
      error
    })
  }, [events, loading, error])

  const handleDelete = async (eventId: string) => {
    console.log('Attempting delete:', eventId)
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return
    }

    try {
      setDeleting(eventId)
      await deleteEvent(eventId)
      router.refresh()
    } catch (error) {
      console.error('Failed to delete event:', error)
      alert('Failed to delete event. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    console.log('Loading state active')
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin text-primary mx-auto' />
          <p className='mt-2 text-sm text-muted-foreground'>
            Loading events...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    console.error('Error in EventsList:', error)
    return (
      <div className='rounded-lg border border-destructive/50 bg-destructive/10 p-4'>
        <p className='text-sm text-destructive'>
          Error loading events: {error.message}
        </p>
      </div>
    )
  }

  console.log('Rendering events:', events?.length || 0)

  if (!events?.length) {
    return (
      <Card className='p-12 text-center'>
        <h3 className='font-semibold text-lg text-foreground'>
          No events found
        </h3>
        <p className='mt-2 text-sm text-muted-foreground'>
          Get started by creating a new event.
        </p>
        <div className='mt-6'>
          <Button asChild>
            <Link href='/events/new'>Create new event</Link>
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {events.map(event => (
        <Card key={event.id} className='overflow-hidden flex flex-col'>
          <div className='p-6 flex-1'>
            <div className='flex items-start justify-between'>
              <h3 className='font-semibold text-foreground truncate'>
                {event.title}
              </h3>
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                  {
                    'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100':
                      event.status === 'published',
                    'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100':
                      event.status === 'draft',
                    'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100':
                      event.status === 'cancelled',
                  }
                )}
              >
                {event.status}
              </span>
            </div>

            <div className='mt-2 text-sm text-muted-foreground line-clamp-2'>
              {event.description}
            </div>

            <div className='mt-4 space-y-2'>
              <div className='flex items-center text-sm text-muted-foreground'>
                <Calendar className='mr-2 h-4 w-4 flex-shrink-0' />
                {formatDate(event.date)}
              </div>

              <div className='flex items-center text-sm text-muted-foreground'>
                <MapPin className='mr-2 h-4 w-4 flex-shrink-0' />
                {event.venue}
              </div>

              <div className='flex items-center text-sm text-muted-foreground'>
                <Users className='mr-2 h-4 w-4 flex-shrink-0' />
                {event.capacity} attendees max
              </div>
            </div>
          </div>

          <div className='border-t border-border bg-muted/50 p-4'>
            <div className='flex justify-between items-center gap-2'>
              <Button asChild variant='ghost' size='sm' className='w-full'>
                <Link
                  href={`/events/${event.id}`}
                  className='flex items-center justify-center'
                >
                  <Eye className='mr-2 h-4 w-4' />
                  View Details
                </Link>
              </Button>

              {user?.id === event.organizer_id && (
                <div className='flex gap-2 shrink-0'>
                  <Button asChild variant='ghost' size='sm'>
                    <Link
                      href={`/events/${event.id}/edit`}
                      className='flex items-center'
                    >
                      <Edit className='mr-2 h-4 w-4' />
                      Edit
                    </Link>
                  </Button>

                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleDelete(event.id)}
                    disabled={deleting === event.id}
                    className={cn(
                      'text-destructive hover:text-destructive',
                      'hover:bg-destructive/10'
                    )}
                  >
                    {deleting === event.id ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Trash2 className='h-4 w-4' />
                    )}
                    <span className='sr-only'>Delete event</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}