// @@filename: src/components/events/ticket-section.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Minus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { type Database } from '@/lib/supabase/types'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-provider'
import { stripe } from '@/lib/stripe/client'

type TicketType = Database['public']['Tables']['ticket_types']['Row']

interface TicketSectionProps {
  ticketTypes: TicketType[]
  eventId: string
}

export function TicketSection({ ticketTypes, eventId }: TicketSectionProps) {
  const [selectedType, setSelectedType] = useState<TicketType | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  const handlePurchase = async () => {
    if (!selectedType) return

    try {
      setLoading(true)
      setError(null)

      if (!user) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketTypeId: selectedType.id,
          quantity,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
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
      setLoading(false)
    }
  }

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader>
        <CardTitle>Select Tickets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ticket Types */}
        {ticketTypes.map((type) => {
          const available = type.quantity - (type.quantity_sold || 0)
          const isAvailable = available > 0
          const isSelected = selectedType?.id === type.id

          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => isAvailable && setSelectedType(type)}
              className={`
                p-4 rounded-lg border cursor-pointer transition-colors
                ${isSelected 
                  ? 'border-yellow-400 bg-yellow-400/5' 
                  : 'border-zinc-800 hover:border-zinc-700'}
                ${!isAvailable && 'opacity-50 cursor-not-allowed'}
              `}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{type.name}</h3>
                  <p className="text-sm text-zinc-400">
                    {available} tickets remaining
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">
                    {formatCurrency(type.price)}
                  </div>
                  {!isAvailable && (
                    <span className="text-sm text-red-400">Sold Out</span>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}

        {/* Quantity Selector */}
        {selectedType && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Quantity</span>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  disabled={quantity >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-zinc-400">Total</span>
                <span className="text-2xl font-bold">
                  {formatCurrency(selectedType.price * quantity)}
                </span>
              </div>
              
              {error && (
                <div className="text-sm text-red-400 mb-4">{error}</div>
              )}

              <Button
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
                onClick={handlePurchase}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Purchase Tickets'
                )}
              </Button>
              
              <p className="text-xs text-zinc-500 text-center mt-4">
                By purchasing tickets you agree to our terms of service
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}