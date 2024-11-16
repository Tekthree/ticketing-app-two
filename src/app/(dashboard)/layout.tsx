// @@filename: src/app/(dashboard)/layout.tsx
import { Sidebar } from '@/components/shared/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <div className="container py-8">
          {children}
        </div>
      </main>
    </div>
  )
}