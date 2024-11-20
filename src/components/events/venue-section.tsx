// @@filename: src/components/events/venue-section.tsx
'use client'

import { MapPin, ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { VenueMap } from '@/components/events/venue-map'

interface VenueSectionProps {
  venue: string
  address: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export function VenueSection({ venue, address, coordinates }: VenueSectionProps) {
  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-yellow-400" />
          Venue
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-lg">{venue}</h3>
          <p className="text-zinc-400 mt-1">{address}</p>
        </div>

        {/* Map Preview */}
        <div className="aspect-video relative overflow-hidden rounded-lg">
          <VenueMap venue={address} className="w-full h-full" />
        </div>

        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank')}
          >
            Open in Maps
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: venue,
                  text: `Check out this venue: ${venue}`,
                  url: window.location.href
                })
              }
            }}
          >
            Share Venue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}