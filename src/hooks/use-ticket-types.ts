import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type Database } from '@/lib/supabase/types'

type TicketType = Database['public']['Tables']['ticket_types']['Row']

export function useTicketTypes(eventId: string) {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  const fetchTicketTypes = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('ticket_types')
        .select('*')
        .eq('event_id', eventId)
        .order('price', { ascending: true })

      if (error) throw error
      setTicketTypes(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
    } finally {
      setLoading(false)
    }
  }, [eventId])

  const createTicketType = async (
    ticketData: Omit<TicketType, 'id' | 'created_at' | 'quantity_sold'>
  ) => {
    try {
      const { data, error } = await supabase
        .from('ticket_types')
        .insert({ ...ticketData, quantity_sold: 0 })
        .select()
        .single()

      if (error) throw error
      setTicketTypes(prev => [...prev, data])
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('An error occurred')
    }
  }

  const updateTicketType = async (id: string, updates: Partial<TicketType>) => {
    try {
      const { data, error } = await supabase
        .from('ticket_types')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setTicketTypes(prev => prev.map(type => (type.id === id ? data : type)))
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('An error occurred')
    }
  }

  const deleteTicketType = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ticket_types')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTicketTypes(prev => prev.filter(type => type.id !== id))
    } catch (err) {
      throw err instanceof Error ? err : new Error('An error occurred')
    }
  }

  useEffect(() => {
    fetchTicketTypes()
  }, [fetchTicketTypes])

  return {
    ticketTypes,
    loading,
    error,
    createTicketType,
    updateTicketType,
    deleteTicketType,
    refreshTicketTypes: fetchTicketTypes,
  }
}
