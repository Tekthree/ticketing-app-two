// @@filename: src/app/(dashboard)/events/new/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EventForm } from '@/components/events/event-form'
import { DashboardHeader } from '@/components/shared/dashboard-header'
import { DashboardShell } from '@/components/shared/dashboard-shell'

export default async function CreateEventPage() {
  const supabase = await createServerSupabaseClient()

  // Check if user is authorized
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify user is an organizer
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!profile || !['admin', 'organizer'].includes(profile.role)) {
    redirect('/events')
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Create Event"
        text="Fill in the details below to create a new event."
      />
      <div className="grid gap-8">
        <EventForm />
      </div>
    </DashboardShell>
  )
}