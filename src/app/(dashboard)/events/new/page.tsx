import { EventForm } from '@/components/events/event-form'

export default function CreateEventPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Create Event</h1>
        <p className='text-muted-foreground'>
          Fill in the details below to create a new event
        </p>
      </div>

      <div className='max-w-2xl'>
        <EventForm />
      </div>
    </div>
  )
}
