'use client'

import { useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { type Database } from '@/lib/supabase/types'

type Event = Database['public']['Tables']['events']['Row'] & {
  ticket_types?: Database['public']['Tables']['ticket_types']['Row'][]
  event_images?: Database['public']['Tables']['event_images']['Row'][]
}

interface TrendingSectionProps {
  events: Event[]
}

export function TrendingSection({ events }: TrendingSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollContainerRef.current || events.length === 0) return

    const scrollContainer = scrollContainerRef.current
    const scrollSpeed = 0.5 // Adjust this value (0.1 to 0.5 for different speeds)
    let accumulatedDelta = 0
    let animationFrameId: number
    let lastTimestamp = 0

    const scroll = (timestamp: number) => {
      if (!scrollContainer) return

      if (lastTimestamp !== 0) {
        const deltaTime = timestamp - lastTimestamp
        accumulatedDelta += (scrollSpeed * deltaTime) / 16 // Normalize to 60fps

        if (accumulatedDelta >= 1) {
          const movement = Math.floor(accumulatedDelta)
          scrollContainer.scrollLeft += movement
          accumulatedDelta -= movement

          // If we've scrolled to the end of the original content
          if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
            scrollContainer.scrollLeft = 0
          }
        }
      }

      lastTimestamp = timestamp
      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    // Pause animation on hover
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationFrameId)
      lastTimestamp = 0 // Reset timestamp on pause
    }

    const handleMouseLeave = () => {
      lastTimestamp = 0 // Reset timestamp on resume
      animationFrameId = requestAnimationFrame(scroll)
    }

    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter)
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [events]) // events dependency is now properly handled

  if (!events?.length) return null

  const getLowestPrice = (event: Event) => {
    if (!event.ticket_types?.length) return null
    return Math.min(...event.ticket_types.map(ticket => ticket.price))
  }

  // Duplicate events array to create seamless loop
  const duplicatedEvents = [...events, ...events]

  return (
    <section className='py-12 bg-background overflow-hidden'>
      <div className='container px-4'>
        <h2 className='text-2xl font-bold tracking-tight mb-6'>Trending</h2>

        <div className='relative'>
          <div
            ref={scrollContainerRef}
            className='flex gap-4 overflow-x-hidden'
          >
            {duplicatedEvents.map((event, index) => {
              const lowestPrice = getLowestPrice(event)
              return (
                <Card
                  key={`${event.id}-${index}`}
                  className='flex-none w-[280px] sm:w-[320px] overflow-hidden border-none bg-card hover:bg-accent/50 transition-colors'
                >
                  <Link href={`/explore/${event.id}`}>
                    <div className='relative aspect-[4/3]'>
                      <Image
                        src={
                          event.event_images?.[0]?.url ||
                          '/api/placeholder/400/300'
                        }
                        alt={event.title}
                        fill
                        className='object-cover'
                      />
                      <Button
                        size='icon'
                        variant='ghost'
                        className='absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full'
                      >
                        <Heart className='h-4 w-4' />
                      </Button>
                    </div>
                    <div className='p-4'>
                      <h3 className='font-semibold mb-1'>{event.title}</h3>
                      <p className='text-sm text-muted-foreground'>
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                      <p className='text-sm text-muted-foreground mb-2'>
                        {event.venue}
                      </p>
                      {lowestPrice && (
                        <p className='font-medium'>
                          From ${lowestPrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </Link>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
