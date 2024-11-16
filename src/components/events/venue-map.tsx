// @@filename: src/components/events/venue-map.tsx
'use client'

import { cn } from '@/lib/utils'

interface VenueMapProps {
  venue: string
  className?: string
}

export function VenueMap({ venue, className }: VenueMapProps) {
  // For demo purposes, we'll use OpenStreetMap
  const encodedAddress = encodeURIComponent(venue)
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=-122.3386,47.6062,-122.3359,47.6089&layer=mapnik&marker=47.6075,-122.3372`

  return (
    <div className={cn('overflow-hidden rounded-lg', className)}>
      <iframe
        title={`Map showing ${venue}`}
        width='100%'
        height='100%'
        frameBorder='0'
        scrolling='no'
        marginHeight={0}
        marginWidth={0}
        src={mapUrl}
        className='border-0'
      />
    </div>
  )
}
