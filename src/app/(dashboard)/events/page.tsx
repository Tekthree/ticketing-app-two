// @@filename: src/app/(dashboard)/events/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/shared/dashboard-header'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { EventsList } from '@/components/events/events-list'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function MyEventsPage() {
  const supabase = await createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Verify user is an organizer
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!profile || !['admin', 'organizer'].includes(profile.role)) {
    redirect('/dashboard')
  }

  // Fetch user's events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <DashboardShell>
      <DashboardHeader
        heading='My Events'
        text='Create and manage your events.'
      >
        <Button asChild>
          <Link href='/events/new'>
            <Plus className='mr-2 h-4 w-4' />
            Create Event
          </Link>
        </Button>
      </DashboardHeader>
      <EventsList events={events || []} />
    </DashboardShell>
  )
}
