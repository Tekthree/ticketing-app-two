import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type Database } from '@/lib/supabase/types'

interface AnalyticsData {
  totalRevenue: number
  totalTicketsSold: number
  totalEvents: number
  revenueByMonth: {
    month: string
    revenue: number
  }[]
  topEvents: {
    eventId: string
    title: string
    ticketsSold: number
    revenue: number
  }[]
  salesByTicketType: {
    ticketType: string
    quantity: number
    revenue: number
  }[]
}

export function useAnalytics(timeRange: 'week' | 'month' | 'year' = 'month') {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get date range
      const now = new Date()
      let startDate = new Date()
      switch (timeRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(now.getMonth() - 1)
          break
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }

      // Fetch total revenue and tickets sold
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(
          `
          total_amount,
          quantity,
          created_at
        `
        )
        .gte('created_at', startDate.toISOString())
        .eq('payment_status', 'completed')

      if (ordersError) throw ordersError

      // Fetch events count
      const { count: eventsCount, error: eventsError } = await supabase
        .from('events')
        .select('*', { count: 'exact' })
        .gte('created_at', startDate.toISOString())

      if (eventsError) throw eventsError

      // Fetch revenue by month
      const revenueByMonth = ordersData.reduce(
        (acc: Record<string, number>, order) => {
          const month = new Date(order.created_at).toLocaleString('en-US', {
            month: 'long',
            year: 'numeric',
          })
          acc[month] = (acc[month] || 0) + order.total_amount
          return acc
        },
        {}
      )

      // Fetch top performing events
      const { data: topEventsData, error: topEventsError } = await supabase
        .from('orders')
        .select(
          `
          quantity,
          total_amount,
          ticket_types (
            event_id,
            events (
              title
            )
          )
        `
        )
        .eq('payment_status', 'completed')
        .gte('created_at', startDate.toISOString())

      if (topEventsError) throw topEventsError

      const topEvents = Object.values(
        topEventsData.reduce((acc: Record<string, any>, order) => {
          const eventId = order.ticket_types.event_id
          if (!acc[eventId]) {
            acc[eventId] = {
              eventId,
              title: order.ticket_types.events.title,
              ticketsSold: 0,
              revenue: 0,
            }
          }
          acc[eventId].ticketsSold += order.quantity
          acc[eventId].revenue += order.total_amount
          return acc
        }, {})
      )
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      // Calculate ticket type distribution
      const { data: ticketTypesData, error: ticketTypesError } = await supabase
        .from('orders')
        .select(
          `
          quantity,
          total_amount,
          ticket_types (
            name
          )
        `
        )
        .eq('payment_status', 'completed')
        .gte('created_at', startDate.toISOString())

      if (ticketTypesError) throw ticketTypesError

      const salesByTicketType = Object.values(
        ticketTypesData.reduce((acc: Record<string, any>, order) => {
          const ticketType = order.ticket_types.name
          if (!acc[ticketType]) {
            acc[ticketType] = {
              ticketType,
              quantity: 0,
              revenue: 0,
            }
          }
          acc[ticketType].quantity += order.quantity
          acc[ticketType].revenue += order.total_amount
          return acc
        }, {})
      ).sort((a, b) => b.quantity - a.quantity)

      setData({
        totalRevenue: ordersData.reduce(
          (sum, order) => sum + order.total_amount,
          0
        ),
        totalTicketsSold: ordersData.reduce(
          (sum, order) => sum + order.quantity,
          0
        ),
        totalEvents: eventsCount || 0,
        revenueByMonth: Object.entries(revenueByMonth).map(
          ([month, revenue]) => ({
            month,
            revenue,
          })
        ),
        topEvents,
        salesByTicketType,
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    data,
    loading,
    error,
    refresh: fetchAnalytics,
  }
}
