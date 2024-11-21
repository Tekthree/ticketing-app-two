// @@filename: src/components/events/ticket-section.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { type Database } from '@/lib/supabase/types'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-provider'
import { cn } from '@/lib/utils'

type TicketType = Database['public']['Tables']['ticket_types']['Row']

interface TicketSectionProps {
  ticketTypes: TicketType[]
  eventId: string
}

export function TicketSection({ ticketTypes, eventId }: TicketSectionProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  // Get lowest price ticket
  const lowestPriceTicket = ticketTypes.reduce((lowest, current) => {
    if (!lowest || current.price < lowest.price) return current
    return lowest
  }, ticketTypes[0])

  const handlePurchase = async () => {
    if (!lowestPriceTicket) return

    try {
      setLoading(true)
      setError(null)

      if (!user) {
        router.push('/login')
        return
      }

      router.push(`/checkout/${eventId}`)
    } catch (err) {
      console.error('Purchase error:', err)
      setError(err instanceof Error ? err.message : 'Error processing purchase')
    } finally {
      setLoading(false)
    }
  }

  if (!lowestPriceTicket) return null

  return (
    <Card className={cn(
      "relative overflow-hidden",
      "bg-zinc-900/50 border-zinc-800",
      "backdrop-blur-sm"
    )}>
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-lg text-zinc-400">From</div>
            <div className="text-3xl lg:text-4xl font-bold">
              {formatCurrency(lowestPriceTicket.price)}
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-400">{error}</div>
          )}
        </div>

        <Button
          className={cn(
            "w-full h-14 text-lg rounded-full",
            "bg-yellow-400 hover:bg-yellow-500 text-black",
            "font-bold transition-colors duration-200"
          )}
          onClick={handlePurchase}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            'Get Tickets'
          )}
        </Button>

        <p className="mt-4 text-center text-sm text-zinc-400">
          {lowestPriceTicket.quantity - (lowestPriceTicket.quantity_sold || 0)} tickets remaining
        </p>
      </CardContent>
    </Card>
  )
}