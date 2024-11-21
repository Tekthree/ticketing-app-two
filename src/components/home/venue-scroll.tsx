// @@filename: src/components/home/venue-scroll.tsx
'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface VenueScrollProps {
  venues: string[]
}

export function VenueScroll({ venues }: VenueScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollRef.current) return

    const scroll = () => {
      if (scrollRef.current) {
        const currentScroll = scrollRef.current.scrollLeft
        const maxScroll =
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth

        if (currentScroll >= maxScroll) {
          scrollRef.current.scrollLeft = 0
        } else {
          scrollRef.current.scrollLeft += 1
        }
      }
    }

    const interval = setInterval(scroll, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='bg-black/95 py-12'>
      <div className='container px-4'>
        <h2 className='text-xl font-semibold text-white mb-6'>
          Venues you've attended
        </h2>

        <div className='relative overflow-hidden'>
          <div
            ref={scrollRef}
            className='flex gap-4 overflow-x-hidden whitespace-nowrap pb-4'
          >
            {[...venues, ...venues].map((venue, index) => (
              <div
                key={`${venue}-${index}`}
                className='inline-flex items-center bg-white/10 rounded-full px-4 py-2 text-white hover:bg-white/20 transition-colors cursor-pointer'
              >
                {venue}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
