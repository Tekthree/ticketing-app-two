// @@filename: src/components/shared/stats-card.tsx
import { Card } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: LucideIcon
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
}: StatsCardProps) {
  return (
    <Card>
      <div className='p-6 space-y-2'>
        <div className='flex items-center justify-between space-y-0'>
          <h3 className='text-sm font-medium text-muted-foreground'>{title}</h3>
          <Icon className='h-5 w-5 text-muted-foreground opacity-75' />
        </div>
        <div>
          <div className='text-2xl font-bold'>{value}</div>
          <p className='text-xs text-muted-foreground'>{description}</p>
        </div>
      </div>
    </Card>
  )
}
