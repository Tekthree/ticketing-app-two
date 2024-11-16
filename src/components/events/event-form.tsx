// @@filename: src/components/events/event-form.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { type Database } from '@/lib/supabase/types'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

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

type Event = Database['public']['Tables']['events']['Row'] & {
  ticket_types?: Database['public']['Tables']['ticket_types']['Row'][]
  event_images?: Database['public']['Tables']['event_images']['Row'][]
}

interface EventFormProps {
  initialData?: Event & { time?: string }
  isEditing?: boolean
}

export function EventForm({ initialData, isEditing }: EventFormProps) {
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
      date: initialData?.date || new Date().toISOString().split('T')[0],
      time: initialData?.time || new Date().toTimeString().slice(0, 5),
      capacity: initialData?.capacity || 100,
      status: (initialData?.status as 'draft' | 'published' | 'cancelled') || 'draft',
    },
  })

  const onSubmit = async (data: EventFormValues) => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error('Not authenticated')

      const eventDateTime = new Date(`${data.date}T${data.time}`)

      const eventData = {
        title: data.title,
        description: data.description,
        venue: data.venue,
        date: eventDateTime.toISOString(),
        organizer_id: user.id,
        capacity: data.capacity,
        status: data.status,
      }

      if (isEditing && initialData) {
        const { error: updateError } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', initialData.id)

        if (updateError) throw updateError

        router.push(`/events/${initialData.id}`)
      } else {
        const { data: newEvent, error: insertError } = await supabase
          .from('events')
          .insert([eventData])
          .select()
          .single()

        if (insertError) throw insertError

        router.push(`/events/${newEvent.id}`)
      }

      router.refresh()
    } catch (error) {
      console.error('Form error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const inputClassName = "mt-1 block w-full rounded-md border-none bg-background shadow-sm ring-1 ring-inset ring-input focus:ring-2 focus:ring-primary text-foreground dark:text-foreground sm:text-sm"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Event Details</h3>
          <p className="text-sm text-muted-foreground">
            {isEditing ? "Update your event information." : "Fill in the details for your new event."}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground dark:text-foreground">
              Event Title
            </label>
            <input
              {...register('title')}
              type="text"
              className={inputClassName}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground dark:text-foreground">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className={inputClassName}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-foreground dark:text-foreground">
                Date
              </label>
              <input
                {...register('date')}
                type="date"
                className={inputClassName}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-foreground dark:text-foreground">
                Time
              </label>
              <input
                {...register('time')}
                type="time"
                className={inputClassName}
              />
              {errors.time && (
                <p className="mt-1 text-sm text-destructive">{errors.time.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-foreground dark:text-foreground">
              Venue
            </label>
            <input
              {...register('venue')}
              type="text"
              className={inputClassName}
            />
            {errors.venue && (
              <p className="mt-1 text-sm text-destructive">{errors.venue.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-foreground dark:text-foreground">
              Capacity
            </label>
            <input
              {...register('capacity', { valueAsNumber: true })}
              type="number"
              min="1"
              className={inputClassName}
            />
            {errors.capacity && (
              <p className="mt-1 text-sm text-destructive">{errors.capacity.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-foreground dark:text-foreground">
              Status
            </label>
            <select
              {...register('status')}
              className={inputClassName}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Event' : 'Create Event'}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}