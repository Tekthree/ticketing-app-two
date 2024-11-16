// @@filename: src/components/events/event-content.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { TicketTypesList } from '@/components/events/ticket-types-list'
import { formatDate } from '@/lib/utils'
import { Calendar, MapPin, Users, Info } from 'lucide-react'
import { type Database } from '@/lib/supabase/types'

type Event = Database['public']['Tables']['events']['Row'] & {
  ticket_types: Database['public']['Tables']['ticket_types']['Row'][]
}

interface EventContentProps {
  event: Event
  organizer: { full_name: string } | null
  ticketTypes: Database['public']['Tables']['ticket_types']['Row'][]
}

export default function EventContent({ event, organizer, ticketTypes }: EventContentProps) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(event.date)}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.venue}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{event.capacity} capacity</span>
                </div>

                {organizer && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Info className="h-4 w-4" />
                    <span>Organized by {organizer.full_name}</span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold">About This Event</h2>
              <div className="mt-4 prose prose-gray max-w-none">
                <p className="text-muted-foreground">{event.description}</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            <Card className="p-6">
              <TicketTypesList ticketTypes={ticketTypes} />
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}