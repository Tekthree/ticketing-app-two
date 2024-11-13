'use client'

import { useState } from 'react'
import { useAnalytics } from '@/hooks/use-analytics'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { EventPerformance } from '@/components/dashboard/event-performance'
import { TicketDistribution } from '@/components/dashboard/ticket-distribution'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  TrendingUp,
  Ticket,
  Calendar,
  ArrowUp,
  ArrowDown,
  Loader2,
} from 'lucide-react'

type TimeRange = 'week' | 'month' | 'year'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month')
  const { data, loading, error } = useAnalytics(timeRange)

  if (loading) {
    return (
      <div className='flex h-[200px] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-gray-400' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-red-600'>
        Error loading analytics: {error.message}
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>
          Analytics Dashboard
        </h1>
        <p className='text-muted-foreground'>
          Overview of your events and ticket sales
        </p>
      </div>

      <div className='flex gap-4'>
        <Button
          variant={timeRange === 'week' ? 'default' : 'outline'}
          onClick={() => setTimeRange('week')}
        >
          Last 7 Days
        </Button>
        <Button
          variant={timeRange === 'month' ? 'default' : 'outline'}
          onClick={() => setTimeRange('month')}
        >
          Last 30 Days
        </Button>
        <Button
          variant={timeRange === 'year' ? 'default' : 'outline'}
          onClick={() => setTimeRange('year')}
        >
          Last Year
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <div className='p-6'>
            <div className='flex items-center space-x-2'>
              <TrendingUp className='h-4 w-4 text-gray-400' />
              <h3 className='text-sm font-medium text-gray-600'>
                Total Revenue
              </h3>
            </div>
            <div className='mt-2 flex items-baseline space-x-2'>
              <span className='text-2xl font-semibold'>
                ${data.totalRevenue.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className='p-6'>
            <div className='flex items-center space-x-2'>
              <Ticket className='h-4 w-4 text-gray-400' />
              <h3 className='text-sm font-medium text-gray-600'>
                Tickets Sold
              </h3>
            </div>
            <div className='mt-2 flex items-baseline space-x-2'>
              <span className='text-2xl font-semibold'>
                {data.totalTicketsSold.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className='p-6'>
            <div className='flex items-center space-x-2'>
              <Calendar className='h-4 w-4 text-gray-400' />
              <h3 className='text-sm font-medium text-gray-600'>
                Total Events
              </h3>
            </div>
            <div className='mt-2 flex items-baseline space-x-2'>
              <span className='text-2xl font-semibold'>{data.totalEvents}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <div className='p-6'>
            <h3 className='font-medium text-gray-900'>Revenue Over Time</h3>
            <div className='mt-2'>
              <RevenueChart data={data.revenueByMonth} />
            </div>
          </div>
        </Card>

        <Card>
          <div className='p-6'>
            <h3 className='font-medium text-gray-900'>
              Ticket Type Distribution
            </h3>
            <div className='mt-2'>
              <TicketDistribution data={data.salesByTicketType} />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className='p-6'>
          <h3 className='font-medium text-gray-900'>Top Performing Events</h3>
          <div className='mt-2'>
            <EventPerformance data={data.topEvents} />
          </div>
        </div>
      </Card>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <div className='p-6'>
            <h3 className='font-medium text-gray-900'>Recent Events</h3>
            <div className='mt-6 flow-root'>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead>
                    <tr>
                      <th className='py-3 text-left text-sm font-semibold text-gray-900'>
                        Event
                      </th>
                      <th className='py-3 text-right text-sm font-semibold text-gray-900'>
                        Sales
                      </th>
                      <th className='py-3 text-right text-sm font-semibold text-gray-900'>
                        Growth
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {data.topEvents.slice(0, 5).map(event => (
                      <tr key={event.eventId}>
                        <td className='py-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {event.title}
                          </div>
                        </td>
                        <td className='py-4 text-right text-sm text-gray-500'>
                          ${event.revenue.toLocaleString()}
                        </td>
                        <td className='py-4 text-right'>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              Math.random() > 0.5
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {Math.random() > 0.5 ? (
                              <>
                                <ArrowUp className='mr-1 h-3 w-3' />
                                {Math.floor(Math.random() * 20) + 1}%
                              </>
                            ) : (
                              <>
                                <ArrowDown className='mr-1 h-3 w-3' />
                                {Math.floor(Math.random() * 20) + 1}%
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className='p-6'>
            <h3 className='font-medium text-gray-900'>Popular Ticket Types</h3>
            <div className='mt-6 flow-root'>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead>
                    <tr>
                      <th className='py-3 text-left text-sm font-semibold text-gray-900'>
                        Type
                      </th>
                      <th className='py-3 text-right text-sm font-semibold text-gray-900'>
                        Sold
                      </th>
                      <th className='py-3 text-right text-sm font-semibold text-gray-900'>
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {data.salesByTicketType.slice(0, 5).map(type => (
                      <tr key={type.ticketType}>
                        <td className='py-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {type.ticketType}
                          </div>
                        </td>
                        <td className='py-4 text-right text-sm text-gray-500'>
                          {type.quantity.toLocaleString()}
                        </td>
                        <td className='py-4 text-right text-sm text-gray-500'>
                          ${type.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
