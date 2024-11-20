// @@filename: src/components/events/event-hero.tsx
'use client'

import { format } from 'date-fns'
import { Calendar, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EventHeroProps {
  title: string
  date: Date
  venue: string
  image?: string
}

export function EventHero({
  title,
  date,
  venue,
  image,
}: EventHeroProps) {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 container mx-auto px-4 py-8">
        {/* Left Column - Sticky Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:sticky lg:top-24 h-fit"
        >
          <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-all hover:scale-105 duration-300"
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <Calendar className="h-12 w-12 text-zinc-700" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column - Event Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            {/* Date Badge */}
            <div className="inline-flex items-center rounded-full bg-yellow-400/10 px-3 py-1 text-sm text-yellow-400">
              <Calendar className="mr-2 h-4 w-4" />
              {format(date, 'EEEE, MMMM d, yyyy • h:mm a')}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {title}
            </h1>

            {/* Venue */}
            <div className="flex items-center text-zinc-400">
              <MapPin className="mr-2 h-5 w-5" />
              {venue}
            </div>

            {/* Action Button */}
            <Button 
              size="lg"
              className={cn(
                "mt-8 w-full bg-yellow-400 hover:bg-yellow-500 text-black",
                "font-bold transition-colors duration-200"
              )}
            >
              Get Tickets
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}