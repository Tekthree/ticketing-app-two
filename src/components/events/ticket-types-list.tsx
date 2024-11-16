// @@filename: src/components/events/ticket-types-list.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { stripe } from '@/lib/stripe/client'
import { formatCurrency } from '@/lib/utils'
import { Loader2, Ticket } from 'lucide-react'
import { type Database } from '@/lib/supabase/types'

type TicketType = Database['public']['Tables']['ticket_types']['Row']

interface TicketTypesListProps {
  ticketTypes: TicketType[]
}

export function TicketTypesList({ ticketTypes }: TicketTypesListProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  const handlePurchase = async (ticketType: TicketType) => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      setLoading(ticketType.id)
      setError(null)

      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketTypeId: ticketType.id,
          quantity: 1,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe checkout
      const stripeInstance = await stripe
      if (!stripeInstance) {
        throw new Error('Failed to load Stripe')
      }

      const { error: stripeError } = await stripeInstance.redirectToCheckout({
        sessionId,
      })

      if (stripeError) {
        throw stripeError
      }
    } catch (err) {
      console.error('Purchase error:', err)
      setError(err instanceof Error ? err.message : 'Error processing purchase')
    } finally {
      setLoading(null)
    }
  }

  if (!ticketTypes.length) {
    return (
      <div className='rounded-lg bg-muted p-4 text-center'>
        <p className='text-sm text-muted-foreground'>
          No tickets available yet
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {ticketTypes.map(ticketType => {
        const available = ticketType.quantity - (ticketType.quantity_sold || 0)
        const isAvailable = available > 0

        return (
          <div
            key={ticketType.id}
            className='rounded-lg border bg-card p-4 transition-colors'
          >
            <div className='flex items-start justify-between'>
              <div>
                <h3 className='font-medium'>{ticketType.name}</h3>
                <p className='text-2xl font-bold'>
                  {formatCurrency(ticketType.price)}
                </p>
                <p className='mt-1 text-sm text-muted-foreground'>
                  {available} tickets remaining
                </p>
              </div>
              <Button
                onClick={() => handlePurchase(ticketType)}
                disabled={!isAvailable || loading === ticketType.id}
              >
                {loading === ticketType.id ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <>
                    <Ticket className='mr-2 h-4 w-4' />
                    {isAvailable ? 'Buy Ticket' : 'Sold Out'}
                  </>
                )}
              </Button>
            </div>

            {ticketType.id === loading && error && (
              <p className='mt-2 text-sm text-destructive'>{error}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
