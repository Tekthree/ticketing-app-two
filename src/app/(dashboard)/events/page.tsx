import { Button } from '@/components/ui/button'
import { EventsList } from '@/components/events/events-list'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function EventsPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Events</h1>
          <p className='text-muted-foreground'>Create and manage your events</p>
        </div>

        <Button asChild>
          <Link href='/events/new'>
            <Plus className='mr-2 h-4 w-4' />
            Create Event
          </Link>
        </Button>
      </div>

      <EventsList />
    </div>
  )
}
