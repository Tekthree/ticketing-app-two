'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { type Database } from '@/lib/supabase/types'
import { Loader2 } from 'lucide-react'

type TicketType = Database['public']['Tables']['ticket_types']['Row']

const purchaseSchema = z.object({
  quantity: z
    .number()
    .min(1, 'Must purchase at least 1 ticket')
    .max(10, 'Maximum 10 tickets per purchase'),
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

type PurchaseFormValues = z.infer<typeof purchaseSchema>

interface TicketPurchaseFormProps {
  ticketType: TicketType
  eventTitle: string
}

export function TicketPurchaseForm({
  ticketType,
  eventTitle,
}: TicketPurchaseFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      quantity: 1,
    },
  })

  const quantity = watch('quantity')
  const totalAmount = quantity * ticketType.price

  const onSubmit = async (data: PurchaseFormValues) => {
    try {
      setLoading(true)
      setError(null)

      // Create a checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketTypeId: ticketType.id,
          quantity: data.quantity,
          customerEmail: data.email,
          customerName: data.name,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const stripe = await import('@stripe/stripe-js').then(mod =>
        mod.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      )

      if (!stripe) {
        throw new Error('Failed to load Stripe')
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (stripeError) {
        throw stripeError
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      setLoading(false)
    }
  }

  const availableQuantity = ticketType.quantity - ticketType.quantity_sold

  if (availableQuantity <= 0) {
    return (
      <div className='text-center p-4 bg-gray-50 rounded-lg'>
        <p className='text-gray-500'>Sold Out</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <h3 className='font-medium text-lg'>{ticketType.name}</h3>
        <p className='text-gray-500'>${ticketType.price.toFixed(2)}</p>
        <p className='text-sm text-gray-500'>
          {availableQuantity} tickets remaining
        </p>
      </div>

      <div>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-gray-700'
        >
          Full Name
        </label>
        <input
          {...register('name')}
          type='text'
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
        />
        {errors.name && (
          <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700'
        >
          Email
        </label>
        <input
          {...register('email')}
          type='email'
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
        />
        {errors.email && (
          <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='quantity'
          className='block text-sm font-medium text-gray-700'
        >
          Quantity
        </label>
        <select
          {...register('quantity', { valueAsNumber: true })}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm'
        >
          {Array.from(
            { length: Math.min(10, availableQuantity) },
            (_, i) => i + 1
          ).map(num => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        {errors.quantity && (
          <p className='mt-1 text-sm text-red-600'>{errors.quantity.message}</p>
        )}
      </div>

      <div className='pt-4 border-t'>
        <div className='flex justify-between text-sm'>
          <span>Price per ticket:</span>
          <span>${ticketType.price.toFixed(2)}</span>
        </div>
        <div className='flex justify-between font-medium text-lg mt-2'>
          <span>Total:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {error && <div className='text-sm text-red-600'>{error}</div>}

      <Button type='submit' className='w-full' disabled={loading}>
        {loading ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Processing...
          </>
        ) : (
          'Purchase Tickets'
        )}
      </Button>

      <p className='text-xs text-gray-500 text-center'>
        By purchasing tickets you agree to our terms of service and refund
        policy.
      </p>
    </form>
  )
}
