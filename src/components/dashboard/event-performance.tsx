'use client'

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

interface EventPerformanceProps {
  data: {
    title: string
    ticketsSold: number
    revenue: number
  }[]
}

export function EventPerformance({ data }: EventPerformanceProps) {
  return (
    <div className='h-[300px] w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={data} layout='vertical'>
          <XAxis
            type='number'
            fontSize={12}
            tickFormatter={value => `$${value}`}
          />
          <YAxis
            dataKey='title'
            type='category'
            fontSize={12}
            width={150}
            tickFormatter={value =>
              value.length > 20 ? `${value.slice(0, 20)}...` : value
            }
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className='rounded-lg border bg-background p-2 shadow-sm'>
                    <div className='space-y-1'>
                      <p className='text-sm font-medium'>
                        {payload[0].payload.title}
                      </p>
                      <p className='text-sm'>
                        Revenue: ${payload[0].value?.toLocaleString()}
                      </p>
                      <p className='text-sm'>
                        Tickets Sold: {payload[0].payload.ticketsSold}
                      </p>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey='revenue' fill='#2563eb' radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
