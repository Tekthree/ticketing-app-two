// @@filename: src/app/(dashboard)/events/[id]/edit/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { DashboardHeader } from '@/components/shared/dashboard-header'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { EventForm } from '@/components/events/event-form'

// Define the params type for dynamic routes
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: PageProps) {
  // Properly await the params
  const resolvedParams = await params
  const supabase = await createServerSupabaseClient()

  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      redirect('/login')
    }

    // Fetch event details with relationships
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select(`
        *,
        ticket_types (
          id,
          name,
          price,
          quantity,
          quantity_sold
        ),
        event_images (
          id,
          url,
          alt
        )
      `)
      .eq('id', resolvedParams.id)
      .single()

    if (eventError || !event) {
      console.error('Event fetch error:', eventError)
      notFound()
    }

    // Check if user owns the event
    if (event.organizer_id !== user.id) {
      redirect('/events')
    }

    // Format date and time for form inputs
    const eventDate = new Date(event.date)
    const dateStr = eventDate.toISOString().split('T')[0]
    const timeStr = eventDate.toTimeString().slice(0, 5)

    const initialData = {
      ...event,
      date: dateStr,
      time: timeStr,
    }

    return (
      <DashboardShell>
        <DashboardHeader
          heading='Edit Event'
          text='Make changes to your event details.'
        />
        <div className='grid gap-8'>
          <EventForm 
            initialData={initialData} 
            isEditing 
            eventId={resolvedParams.id}
          />
        </div>
      </DashboardShell>
    )
  } catch (error) {
    console.error('Edit page error:', error)
    return (
      <DashboardShell>
        <DashboardHeader
          heading='Error'
          text='An error occurred while loading the event.'
        />
        <div className='rounded-md bg-destructive/10 p-4'>
          <p className='text-sm text-destructive'>
            Unable to load event details. Please try again later.
          </p>
        </div>
      </DashboardShell>
    )
  }
}