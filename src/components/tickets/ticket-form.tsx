// @@filename: src/components/tickets/ticket-form.tsx

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { type Database } from '@/lib/supabase/types'
import { CreditCard, Minus, Plus, Ticket } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/helpers'

type TicketType = Database['public']['Tables']['ticket_types']['Row']

const ticketPurchaseSchema = z.object({
  ticketTypeId: z.string().min(1, 'Please select a ticket type'),
  quantity: z
    .number()
    .min(1, 'Minimum 1 ticket required')
    .max(10, 'Maximum 10 tickets per purchase'),
})

type TicketPurchaseFormValues = z.infer<typeof ticketPurchaseSchema>

interface TicketFormProps {
  eventId: string
  ticketTypes: (TicketType & { available: number })[]
  onSubmit: (data: {
    ticketTypeId: string
    quantity: number
    totalAmount: number
  }) => Promise<void>
}

export function TicketForm({
  eventId,
  ticketTypes,
  onSubmit,
}: TicketFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<TicketType | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TicketPurchaseFormValues>({
    resolver: zodResolver(ticketPurchaseSchema),
    defaultValues: {
      ticketTypeId: '',
      quantity: 1,
    },
  })

  const quantity = watch('quantity')

  const handleTypeSelect = (type: TicketType) => {
    setSelectedType(type)
    setValue('ticketTypeId', type.id)
  }

  const adjustQuantity = (amount: number) => {
    const newQuantity = quantity + amount
    if (newQuantity >= 1 && newQuantity <= 10) {
      setValue('quantity', newQuantity)
    }
  }

  const handleFormSubmit = async (data: TicketPurchaseFormValues) => {
    if (!selectedType) return

    try {
      setLoading(true)
      setError(null)

      await onSubmit({
        ticketTypeId: data.ticketTypeId,
        quantity: data.quantity,
        totalAmount: selectedType.price * data.quantity,
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium mb-4'>Select Ticket Type</h3>
        <div className='space-y-3'>
          {ticketTypes.map(type => (
            <div
              key={type.id}
              onClick={() => type.available > 0 && handleTypeSelect(type)}
              className={`p-4 rounded-lg border transition-colors ${
                selectedType?.id === type.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              } ${
                type.available === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
            >
              <div className='flex justify-between items-center'>
                <div>
                  <h4 className='font-medium'>{type.name}</h4>
                  <p className='text-sm text-muted-foreground'>
                    {type.available} tickets remaining
                  </p>
                </div>
                <div className='text-right'>
                  <div className='font-medium'>
                    {formatCurrency(type.price)}
                  </div>
                  {type.available === 0 && (
                    <span className='text-sm text-red-600'>Sold Out</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {errors.ticketTypeId && (
          <p className='mt-1 text-sm text-red-600'>
            {errors.ticketTypeId.message}
          </p>
        )}
      </div>

      {selectedType && (
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Quantity
          </label>
          <div className='flex items-center space-x-4'>
            <Button
              type='button'
              variant='outline'
              size='icon'
              onClick={() => adjustQuantity(-1)}
              disabled={quantity <= 1}
            >
              <Minus className='h-4 w-4' />
            </Button>
            <input
              {...register('quantity', { valueAsNumber: true })}
              type='number'
              className='w-16 text-center rounded-md border-gray-300'
              min='1'
              max='10'
            />
            <Button
              type='button'
              variant='outline'
              size='icon'
              onClick={() => adjustQuantity(1)}
              disabled={quantity >= 10}
            >
              <Plus className='h-4 w-4' />
            </Button>
          </div>
          {errors.quantity && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.quantity.message}
            </p>
          )}
        </div>
      )}

      {selectedType && (
        <div className='border-t pt-4'>
          <div className='flex justify-between items-center mb-4'>
            <span className='text-sm text-gray-600'>Total Amount</span>
            <span className='text-lg font-medium'>
              {formatCurrency(selectedType.price * quantity)}
            </span>
          </div>
          <div className='text-sm text-muted-foreground mb-4'>
            Maximum 10 tickets per purchase
          </div>
        </div>
      )}

      {error && <div className='text-sm text-red-600'>{error}</div>}

      <Button
        type='submit'
        className='w-full'
        disabled={loading || !selectedType}
      >
        <CreditCard className='mr-2 h-4 w-4' />
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </Button>
    </form>
  )
}
