// @@filename: src/components/events/event-form.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'

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
  status: z.enum(['draft', 'published']),
})

type EventFormValues = z.infer<typeof eventSchema>

interface EventFormProps {
  initialData?: Partial<EventFormValues>
  onSuccess?: () => void
}

export function EventForm({ initialData, onSuccess }: EventFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
      date: initialData?.date || '',
      time: initialData?.time || '',
      capacity: initialData?.capacity || 100,
      status: initialData?.status || 'draft',
    },
  })

  const onSubmit = async (data: EventFormValues) => {
    try {
      setLoading(true)
      setError(null)
      console.log('Starting event creation...')

      // Check user authentication
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      console.log('Current user:', user)

      if (userError) {
        console.error('Auth error:', userError)
        throw userError
      }
      if (!user) throw new Error('Not authenticated')

      // Check user's profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      console.log('User profile:', profile)

      if (profileError) {
        console.error('Profile error:', profileError)
        throw profileError
      }

      // Prepare event data
      const eventData = {
        title: data.title,
        description: data.description,
        venue: data.venue,
        date: new Date(`${data.date}T${data.time}`).toISOString(),
        organizer_id: user.id,
        capacity: data.capacity,
        status: data.status,
      }
      console.log('Attempting to create event with data:', eventData)

      // Create event
      const { data: newEvent, error: insertError } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single()

      if (insertError) {
        console.error('Event creation error:', insertError)
        throw insertError
      }

      console.log('Event created successfully:', newEvent)
      router.push('/events')
      router.refresh()
      onSuccess?.()
    } catch (error) {
      console.error('Full error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

   const createEvent = async (
     eventData: Omit<EventFormValues, 'id' | 'created_at'>
   ) => {
     const { data: newEvent, error: insertError } = await supabase
       .from('events')
       .insert([eventData])
       .select()
       .single()

     if (insertError) {
       console.error('Event creation error:', insertError)
       throw insertError
     }

     return newEvent
   }

   const updateEvent = async (
     id: string,
     updates: Partial<EventFormValues>
   ) => {
     const { data: updatedEvent, error: updateError } = await supabase
       .from('events')
       .update(updates)
       .eq('id', id)
       .select()
       .single()

     if (updateError) {
       console.error('Event update error:', updateError)
       throw updateError
     }

     return updatedEvent
   }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='space-y-4'>
        <div>
          <label
            htmlFor='title'
            className='block text-sm font-medium text-gray-700'
          >
            Event Title
          </label>
          <div className='mt-1'>
            <input
              {...register('title')}
              type='text'
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
              placeholder='Enter event title'
            />
            {errors.title && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.title.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor='description'
            className='block text-sm font-medium text-gray-700'
          >
            Description
          </label>
          <div className='mt-1'>
            <textarea
              {...register('description')}
              rows={4}
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
              placeholder='Describe your event'
            />
            {errors.description && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label
              htmlFor='date'
              className='block text-sm font-medium text-gray-700'
            >
              Date
            </label>
            <div className='mt-1 relative'>
              <input
                {...register('date')}
                type='date'
                className='block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
              />
              <Calendar className='absolute right-3 top-2 h-5 w-5 text-gray-400' />
              {errors.date && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='time'
              className='block text-sm font-medium text-gray-700'
            >
              Time
            </label>
            <div className='mt-1 relative'>
              <input
                {...register('time')}
                type='time'
                className='block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
              />
              <Clock className='absolute right-3 top-2 h-5 w-5 text-gray-400' />
              {errors.time && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.time.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor='venue'
            className='block text-sm font-medium text-gray-700'
          >
            Venue
          </label>
          <div className='mt-1 relative'>
            <input
              {...register('venue')}
              type='text'
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
              placeholder='Enter venue location'
            />
            <MapPin className='absolute right-3 top-2 h-5 w-5 text-gray-400' />
            {errors.venue && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.venue.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor='capacity'
            className='block text-sm font-medium text-gray-700'
          >
            Capacity
          </label>
          <div className='mt-1 relative'>
            <input
              {...register('capacity', { valueAsNumber: true })}
              type='number'
              min='1'
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
            />
            <Users className='absolute right-3 top-2 h-5 w-5 text-gray-400' />
            {errors.capacity && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.capacity.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor='status'
            className='block text-sm font-medium text-gray-700'
          >
            Status
          </label>
          <div className='mt-1'>
            <select
              {...register('status')}
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
            >
              <option value='draft'>Draft</option>
              <option value='published'>Published</option>
            </select>
            {errors.status && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.status.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {error && <div className='text-sm text-red-600'>{error}</div>}

      <div className='flex gap-4'>
        <Button type='submit' disabled={loading}>
          {loading
            ? 'Saving...'
            : initialData
              ? 'Update Event'
              : 'Create Event'}
        </Button>

        <Button
          type='button'
          variant='ghost'
          onClick={() => router.push('/events')}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
