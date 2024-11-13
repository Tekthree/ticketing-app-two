'use client'

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface RevenueChartProps {
  data: {
    month: string
    revenue: number
  }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className='h-[400px] w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={data}>
          <XAxis
            dataKey='month'
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={value => `$${value}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className='rounded-lg border bg-background p-2 shadow-sm'>
                    <div className='grid grid-cols-2 gap-2'>
                      <div className='font-medium'>
                        {payload[0].payload.month}
                      </div>
                      <div className='font-medium text-right'>
                        ${payload[0].value?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type='monotone'
            dataKey='revenue'
            stroke='#2563eb'
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
