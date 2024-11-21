// @@filename: src/components/events/event-hero.tsx
'use client'

import { format } from 'date-fns'
import { Calendar, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

interface EventHeroProps {
  title: string
  date: Date
  venue: string
}

export function EventHero({
  title,
  date,
  venue,
}: EventHeroProps) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
      >
        {title}
      </motion.h1>

      {/* Date & Venue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-4 text-lg"
      >
        <div className="flex items-center text-yellow-400">
          <Calendar className="mr-2 h-5 w-5" />
          {format(date, 'EEEE, MMMM d, yyyy • h:mm a')}
        </div>
        <div className="flex items-center text-zinc-400">
          <MapPin className="mr-2 h-5 w-5" />
          {venue}
        </div>
      </motion.div>
    </div>
  )
}