// @@filename: src/components/events/event-content.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Info, MapPin, Clock, Users } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { type Database } from '@/lib/supabase/types'

type Event = Database['public']['Tables']['events']['Row']
type TicketType = Database['public']['Tables']['ticket_types']['Row']

interface EventContentProps {
  event: Event
  ticketTypes: TicketType[]
  organizer: { full_name: string } | null
}

export function EventContent({ event, ticketTypes, organizer }: EventContentProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // Calculate available tickets and price range
  const availableTickets = ticketTypes.reduce((acc, type) => 
    acc + (type.quantity - (type.quantity_sold || 0)), 0
  )
  const priceRange = ticketTypes.reduce(
    (range, type) => ({
      min: Math.min(range.min, type.price),
      max: Math.max(range.max, type.price),
    }),
    { min: Infinity, max: -Infinity }
  )

  return (
    <div className="space-y-8">
      {/* Ticket Information */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle>Ticket Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ticketTypes.map((ticket) => {
            const available = ticket.quantity - (ticket.quantity_sold || 0)
            const isAvailable = available > 0
            
            return (
              <div
                key={ticket.id}
                className="flex justify-between items-center py-3 border-b border-zinc-800 last:border-0"
              >
                <div className="space-y-1">
                  <div className="font-medium">{ticket.name}</div>
                  <div className="text-sm text-zinc-400">
                    {available} tickets remaining
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">
                    {formatCurrency(ticket.price)}
                  </div>
                  {!isAvailable && (
                    <span className="text-sm text-red-400">Sold Out</span>
                  )}
                </div>
              </div>
            )
          })}
          
          <Button 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
            disabled={availableTickets === 0}
          >
            {availableTickets > 0 ? 'Buy Tickets' : 'Sold Out'}
          </Button>
        </CardContent>
      </Card>

      {/* Event Details Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-zinc-400">Date and time</div>
                    <div className="font-medium">
                      {formatDate(event.date)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-zinc-400">Price</div>
                    <div className="font-medium">
                      {priceRange.min === priceRange.max
                        ? formatCurrency(priceRange.min)
                        : `${formatCurrency(priceRange.min)} - ${formatCurrency(priceRange.max)}`}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-zinc-400">Location</div>
                  <div className="font-medium">{event.venue}</div>
                </div>

                {organizer && (
                  <div className="space-y-2">
                    <div className="text-sm text-zinc-400">Organizer</div>
                    <div className="font-medium">{organizer.full_name}</div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="text-sm text-zinc-400">About this event</div>
                  <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4 mt-6">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Event Policies</h3>
                  <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                    <li>All sales are final</li>
                    <li>No refunds or exchanges</li>
                    <li>Valid ID required for entry</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Age Restrictions</h3>
                  <p className="text-sm text-zinc-400">
                    This is an all-ages event. Under 18 must be accompanied by an adult.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}