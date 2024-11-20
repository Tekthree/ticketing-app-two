// @@filename: src/app/(dashboard)/tickets/page.tsx

import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { TicketList } from '@/components/tickets/ticket-list'
import { DashboardHeader } from '@/components/shared/dashboard-header'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { redirect } from 'next/navigation'



async function getOrders() {
  const supabase = await createServerSupabaseClient()

  // First verify the user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Now fetch the orders with proper relationships
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select(
      `
      id,
      quantity,
      total_amount,
      payment_status, 
      created_at,
      ticket_types (
        name,
        events (
          title,
          date,
          venue
        )
      )  
    `
    )
    .eq('user_id', user.id)
    .eq('payment_status', 'completed')
    .order('created_at', { ascending: false })

  if (ordersError) {
    console.error('Error fetching orders:', ordersError)
    throw new Error('Failed to fetch orders')
  }

  return orders
}

export default async function TicketsPage() {
  const orders = await getOrders()

  return (
    <DashboardShell>
      <DashboardHeader
        heading='My Tickets'
        text='View and manage your event tickets.'
      >
        <Button asChild>
          <Link href='/explore'>
            <Plus className='mr-2 h-4 w-4' />
            Find Events
          </Link>
        </Button>
      </DashboardHeader>
      <div className='grid gap-8'>
        <TicketList orders={orders ?? []} />
      </div>
    </DashboardShell>
  )
}
