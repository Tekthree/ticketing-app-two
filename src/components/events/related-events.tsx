// @@filename: src/components/events/related-events.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, MapPin } from 'lucide-react'
import { type Database } from '@/lib/supabase/types'

type Event = Database['public']['Tables']['events']['Row']

interface RelatedEventsProps {
  currentEventId: string
  venueId: string
}

export default function RelatedEvents({ currentEventId, venueId }: RelatedEventsProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchRelatedEvents() {
      try {
        const { data } = await supabase
          .from('events')
          .select('*')
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
  }, [currentEventId, venueId])

  if (loading || events.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            More Events at this Venue
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            >
              <Card className="group relative isolate flex flex-col justify-end overflow-hidden rounded-2xl px-8 pb-8 pt-40 h-[400px]">
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-900/30 via-gray-900/20" />

                <h3 className="mt-3 text-2xl font-semibold leading-6 text-white">
                  <Link href={`/explore/${event.id}`}>
                    <span className="absolute inset-0" />
                    {event.title}
                  </Link>
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm leading-6 text-gray-300">
                  <div className="flex items-center gap-x-2">
                    <Calendar className="h-5 w-5" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center gap-x-2">
                    <MapPin className="h-5 w-5" />
                    {event.venue}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}