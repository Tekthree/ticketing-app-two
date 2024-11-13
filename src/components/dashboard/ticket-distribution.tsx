'use client'

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'

interface TicketDistributionProps {
  data: {
    ticketType: string
    quantity: number
  }[]
}

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe']

export function TicketDistribution({ data }: TicketDistributionProps) {
  return (
    <div className='h-[300px] w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            labelLine={false}
            outerRadius={100}
            fill='#8884d8'
            dataKey='quantity'
            nameKey='ticketType'
            label={({ ticketType, value, percent }) =>
              `${ticketType}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className='rounded-lg border bg-background p-2 shadow-sm'>
                    <div className='space-y-1'>
                      <p className='text-sm font-medium'>{payload[0].name}</p>
                      <p className='text-sm'>Quantity: {payload[0].value}</p>
                      <p className='text-sm'>
                        Share:{' '}
                        {(
                          (payload[0].value /
                            data.reduce((sum, d) => sum + d.quantity, 0)) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
