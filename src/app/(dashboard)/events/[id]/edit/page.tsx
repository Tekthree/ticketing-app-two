import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { DashboardHeader } from '@/components/shared/dashboard-header'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { EventForm } from '@/components/events/event-form'

// Use Next.js type for route params
interface PageProps {
  params: { id: string }
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = params

  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch event details
  const { data: event, error } = await supabase
    .from('events')
    .select(
      `
      *,
      ticket_types (*),
      event_images (*)
    `
    )
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  if (event.organizer_id !== user.id) {
    redirect('/events')
  }

  // Convert event date to input format
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
        <EventForm initialData={initialData} isEditing />
      </div>
    </DashboardShell>
  )
}
