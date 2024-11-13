'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { type Database } from '@/lib/supabase/types'
import { DollarSign, Ticket, X } from 'lucide-react'

type TicketType = Database['public']['Tables']['ticket_types']['Row']

const ticketTypeSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
})

type TicketTypeFormValues = z.infer<typeof ticketTypeSchema>

interface TicketTypeFormProps {
  eventId: string
  onSubmit: (
    data: Omit<TicketType, 'id' | 'created_at' | 'quantity_sold'>
  ) => Promise<void>
  onCancel: () => void
  initialData?: Partial<TicketTypeFormValues>
}

export function TicketTypeForm({
  eventId,
  onSubmit,
  onCancel,
  initialData,
}: TicketTypeFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TicketTypeFormValues>({
    resolver: zodResolver(ticketTypeSchema),
    defaultValues: {
      name: initialData?.name || '',
      price: initialData?.price || 0,
      quantity: initialData?.quantity || 100,
    },
  })

  const handleFormSubmit = async (data: TicketTypeFormValues) => {
    try {
      setLoading(true)
      setError(null)

      await onSubmit({
        event_id: eventId,
        name: data.name,
        price: data.price,
        quantity: data.quantity,
      })

      onCancel()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-medium'>
          {initialData ? 'Edit Ticket Type' : 'Add Ticket Type'}
        </h3>
        <Button type='button' variant='ghost' size='sm' onClick={onCancel}>
          <X className='h-4 w-4' />
        </Button>
      </div>

      <div>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-gray-700'
        >
          Ticket Name
        </label>
        <div className='mt-1 relative'>
          <input
            {...register('name')}
            type='text'
            className='block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
            placeholder='e.g., Early Bird, VIP, Regular'
          />
          <Ticket className='absolute right-3 top-2 h-5 w-5 text-gray-400' />
        </div>
        {errors.name && (
          <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='price'
          className='block text-sm font-medium text-gray-700'
        >
          Price
        </label>
        <div className='mt-1 relative'>
          <input
            {...register('price', { valueAsNumber: true })}
            type='number'
            step='0.01'
            min='0'
            className='block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
          />
          <DollarSign className='absolute right-3 top-2 h-5 w-5 text-gray-400' />
        </div>
        {errors.price && (
          <p className='mt-1 text-sm text-red-600'>{errors.price.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='quantity'
          className='block text-sm font-medium text-gray-700'
        >
          Available Quantity
        </label>
        <div className='mt-1'>
          <input
            {...register('quantity', { valueAsNumber: true })}
            type='number'
            min='1'
            className='block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
          />
        </div>
        {errors.quantity && (
          <p className='mt-1 text-sm text-red-600'>{errors.quantity.message}</p>
        )}
      </div>

      {error && <div className='text-sm text-red-600'>{error}</div>}

      <div className='flex justify-end gap-4'>
        <Button
          type='button'
          variant='ghost'
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type='submit' disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update' : 'Add'}
        </Button>
      </div>
    </form>
  )
}
