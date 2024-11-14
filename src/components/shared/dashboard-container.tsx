// @@filename: src/components/shared/dashboard-container.tsx
import { cn } from '@/lib/utils'

interface DashboardContainerProps {
  children: React.ReactNode
  className?: string
}

export function DashboardContainer({
  children,
  className,
}: DashboardContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}
    >
      {children}
    </div>
  )
}
