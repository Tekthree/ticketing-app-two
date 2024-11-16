// @@filename: src/components/events/event-hero.tsx
'use client'

import { format } from 'date-fns'
import { Calendar, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

interface EventHeroProps {
  title: string
  date: Date
  venue: string
  image?: string
}

export default function EventHero({ title, date, venue, image }: EventHeroProps) {
  return (
    <div className="relative">
      {/* Background blur effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-3xl opacity-30"
        style={{ 
          backgroundImage: image ? `url(${image})` : 'none',
          maskImage: 'linear-gradient(to bottom, black, transparent)'
        }} 
      />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[70vh] flex-col items-start justify-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            {/* Date - with light purple highlight */}
            <div className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-600">
              <Calendar className="mr-1 h-4 w-4" />
              {format(date, 'EEEE, MMMM d, yyyy • h:mm a')}
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {title}
            </h1>

            <div className="mt-4 flex items-center text-gray-600">
              <MapPin className="mr-1 h-5 w-5" />
              {venue}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}