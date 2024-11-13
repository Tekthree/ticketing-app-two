'use client'

import { useState } from 'react'
import { useEvents } from '@/hooks/use-events'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/auth-provider'
import { Calendar, MapPin, Users, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

export function EventsList() {
  const { events, loading, error, deleteEvent } = useEvents()
  const { user } = useAuth()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (eventId: string) => {
    try {
      setDeleting(eventId)
      await deleteEvent(eventId)
    } catch (error) {
      console.error('Failed to delete event:', error)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return <div className='text-center'>Loading events...</div>
  }

  if (error) {
    return (
      <div className='text-red-600'>Error loading events: {error.message}</div>
    )
  }

  if (events.length === 0) {
    return (
      <div className='text-center'>
        <h3 className='mt-2 text-sm font-semibold text-gray-900'>No events</h3>
        <p className='mt-1 text-sm text-gray-500'>
          Get started by creating a new event.
        </p>
        <div className='mt-6'>
          <Button asChild>
            <Link href='/events/new'>Create new event</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {events.map(event => (
          <div
            key={event.id}
            className='bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200'
          >
            <div className='px-4 py-5 sm:p-6'>
              <h3 className='text-lg font-medium text-gray-900 truncate'>
                {event.title}
              </h3>

              <div className='mt-2 text-sm text-gray-500 line-clamp-2'>
                {event.description}
              </div>

              <div className='mt-4 space-y-2'>
                <div className='flex items-center text-sm text-gray-500'>
                  <Calendar className='mr-2 h-4 w-4' />
                  {new Date(event.date).toLocaleDateString()}
                </div>

                <div className='flex items-center text-sm text-gray-500'>
                  <MapPin className='mr-2 h-4 w-4' />
                  {event.venue}
                </div>

                <div className='flex items-center text-sm text-gray-500'>
                  <Users className='mr-2 h-4 w-4' />
                  {event.capacity} attendees max
                </div>
              </div>

              <div className='mt-4'>
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
            </div>

            <div className='px-4 py-4 sm:px-6 flex justify-between items-center'>
              <Button asChild variant='ghost' size='sm'>
                <Link href={`/events/${event.id}`}>
                  <Eye className='mr-2 h-4 w-4' />
                  View
                </Link>
              </Button>

              {user?.id === event.organizer_id && (
                <div className='flex gap-2'>
                  <Button asChild variant='ghost' size='sm'>
                    <Link href={`/events/${event.id}/edit`}>
                      <Edit className='mr-2 h-4 w-4' />
                      Edit
                    </Link>
                  </Button>

                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDelete(event.id)}
                    disabled={deleting === event.id}
                  >
                    <Trash2 className='mr-2 h-4 w-4' />
                    {deleting === event.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
