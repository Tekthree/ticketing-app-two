// @@filename: src/components/events/related-events.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, MapPin } from 'lucide-react'

interface RelatedEventsProps {
  currentEventId: string
  venueId: string
}

export function RelatedEvents({ currentEventId, venueId }: RelatedEventsProps) {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchRelatedEvents() {
      try {
        const { data } = await supabase
          .from('events')
          .select(`
            *,
            event_images (*)
          `)
          .eq('venue', venueId)
          .neq('id', currentEventId)
          .eq('status', 'published')
          .gte('date', new Date().toISOString())
          .order('date', { ascending: true })
          .limit(3)

        setEvents(data || [])
      } catch (error) {
        console.error('Error fetching related events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedEvents()
  }, [currentEventId, venueId, supabase])

  if (loading || events.length === 0) {
    return null
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-zinc-900/50 border-zinc-800 h-full">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-yellow-400 text-sm">
                    <Calendar className="inline-block w-4 h-4 mr-2" />
                    {formatDate(event.date)}
                  </div>
                  <h3 className="font-medium text-lg line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="text-zinc-400 text-sm flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.venue}
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link href={`/explore/${event.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}