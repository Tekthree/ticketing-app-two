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
    <div className='rounded-lg border bg-card text-card-foreground shadow'>
      <div className='p-6 flex flex-row items-center justify-between space-y-0 pb-2'>
        <h3 className='tracking-tight text-sm font-medium'>{title}</h3>
        <Icon className='h-5 w-5 text-muted-foreground' />
      </div>
      <div className='p-6 pt-0'>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </div>
    </div>
  )
}
