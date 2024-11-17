// @@filename: src/components/events/event-card.tsx
'use client'

import { Calendar, MapPin, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface EventCardProps {
  id: string
  title: string
  date: string
  venue: string
  price: number
  imageUrl?: string
  className?: string
  status?: 'draft' | 'published' | 'cancelled'
  actions?: React.ReactNode
  isDashboard?: boolean
}

export function EventCard({
  id,
  title,
  date,
  venue,
  price,
  imageUrl,
  className,
  status,
  actions,
  isDashboard = false,
}: EventCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-all hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <Calendar className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        {status && (
          <div className="absolute right-2 top-2">
            <Badge variant={
              status === 'published' ? 'default' :
              status === 'draft' ? 'secondary' : 'destructive'
            }>
              {status}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="grid gap-2.5 p-4">
        <h3 className="line-clamp-1 text-lg font-semibold">{title}</h3>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{venue}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          <span className="font-semibold">
            ${price.toFixed(2)}
          </span>
          <div className="flex gap-2">
            {actions ? actions : (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                >
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Add to wishlist</span>
                </Button>
                <Button asChild className="h-8">
                  <Link href={isDashboard ? `/dashboard/events/${id}` : `/explore/${id}`}>
                    {isDashboard ? 'View Details' : 'Get Tickets'}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}