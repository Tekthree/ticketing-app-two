// @@filename: src/components/home/featured-event-card.tsx
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface FeaturedEventCardProps {
  id: string
  title: string
  description: string
  date: string
  venue: string
  capacity: number
}

export function FeaturedEventCard({
  id,
  title,
  description,
  date,
  venue,
  capacity,
}: FeaturedEventCardProps) {
  return (
    <Card className='flex h-full flex-col'>
      <CardHeader>
        <CardTitle className='line-clamp-2'>{title}</CardTitle>
      </CardHeader>
      <CardContent className='flex-1'>
        <p className='mb-4 line-clamp-2 text-muted-foreground'>{description}</p>
        <div className='space-y-2'>
          <div className='flex items-center text-sm text-muted-foreground'>
            <Calendar className='mr-2 h-4 w-4' />
            {formatDate(date)}
          </div>
          <div className='flex items-center text-sm text-muted-foreground'>
            <MapPin className='mr-2 h-4 w-4' />
            {venue}
          </div>
          <div className='flex items-center text-sm text-muted-foreground'>
            <Users className='mr-2 h-4 w-4' />
            {capacity} capacity
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className='w-full'>
          <Link href={`/events/${id}`}>View Event</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
