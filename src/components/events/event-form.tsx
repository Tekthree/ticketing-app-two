// @@filename: src/components/events/event-form.tsx
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { ImageUpload } from './image-upload'
import { Card } from '@/components/ui/card'

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  venue: z.string().min(3, 'Venue must be at least 3 characters'),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Please enter a valid date',
  }),
  time: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Please enter a valid time (HH:MM)'
    ),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  status: z.enum(['draft', 'published', 'cancelled']),
})

type EventFormValues = z.infer<typeof eventSchema>

interface EventFormProps {
  initialData?: Partial<EventFormValues> & { id?: string }
  onSuccess?: () => void
}

export function EventForm({ initialData, onSuccess }: EventFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<Array<{ id: string; url: string; alt: string }>>([])
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      venue: initialData?.venue || '',
      date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
      time: initialData?.date ? new Date(initialData.date).toTimeString().slice(0, 5) : '',
      capacity: initialData?.capacity || 100,
      status: initialData?.status || 'draft',
    },
  })

  // Fetch existing images if editing
  useEffect(() => {
    if (initialData?.id) {
      const fetchImages = async () => {
        const { data: eventImages, error } = await supabase
          .from('event_images')
          .select('*')
          .eq('event_id', initialData.id)
          .order('created_at')

        if (!error && eventImages) {
          setImages(eventImages)
        }
      }

      fetchImages()
    }
  }, [initialData?.id])

  const onSubmit = async (data: EventFormValues) => {
    try {
      setLoading(true)
      setError(null)
      console.log('Starting event creation/update...')

      // Check user authentication
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      
      if (userError) throw userError
      if (!user) throw new Error('Not authenticated')

      // Combine date and time
      const eventDateTime = new Date(`${data.date}T${data.time}`)

      // Prepare event data
      const eventData = {
        title: data.title,
        description: data.description,
        venue: data.venue,
        date: eventDateTime.toISOString(),
        organizer_id: user.id,
        capacity: data.capacity,
        status: data.status,
      }

      let eventId = initialData?.id

      if (eventId) {
        // Update existing event
        const { error: updateError } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', eventId)

        if (updateError) throw updateError
      } else {
        // Create new event
        const { data: newEvent, error: insertError } = await supabase
          .from('events')
          .insert([eventData])
          .select()
          .single()

        if (insertError) throw insertError
        eventId = newEvent.id
      }

      router.push(`/events/${eventId}`)
      router.refresh()
      onSuccess?.()
    } catch (error) {
      console.error('Form error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleImagesUpdate = async () => {
    if (initialData?.id) {
      const { data: eventImages } = await supabase
        .from('event_images')
        .select('*')
        .eq('event_id', initialData.id)
        .order('created_at')

      if (eventImages) {
        setImages(eventImages)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Event Title
            </label>
            <div className="mt-1">
              <input
                {...register('title')}
                type="text"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Enter event title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <div className="mt-1">
              <textarea
                {...register('description')}
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Describe your event"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Date and Time */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Date and Time</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <div className="mt-1 relative">
              <input
                {...register('date')}
                type="date"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              <Calendar className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="time"
              className="block text-sm font-medium text-gray-700"
            >
              Time
            </label>
            <div className="mt-1 relative">
              <input
                {...register('time')}
                type="time"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              <Clock className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.time.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Location and Capacity */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Location and Capacity</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="venue"
              className="block text-sm font-medium text-gray-700"
            >
              Venue
            </label>
            <div className="mt-1 relative">
              <input
                {...register('venue')}
                type="text"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Enter venue location"
              />
              <MapPin className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
              {errors.venue && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.venue.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="capacity"
              className="block text-sm font-medium text-gray-700"
            >
              Capacity
            </label>
            <div className="mt-1 relative">
              <input
                {...register('capacity', { valueAsNumber: true })}
                type="number"
                min="1"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              <Users className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.capacity.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Images */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Event Images</h3>
        {initialData?.id ? (
          <ImageUpload
            eventId={initialData.id}
            existingImages={images}
            onUploadComplete={handleImagesUpdate}
          />
        ) : (
          <p className="text-sm text-gray-500">
            Save the event first to enable image uploads
          </p>
        )}
      </Card>

      {/* Status */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Event Status</h3>
        <div>
          <select
            {...register('status')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">
              {errors.status.message}
            </p>
          )}
        </div>
      </Card>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading
            ? 'Saving...'
            : initialData
            ? 'Update Event'
            : 'Create Event'}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/events')}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}