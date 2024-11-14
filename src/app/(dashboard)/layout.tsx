// @@filename: src/app/(dashboard)/layout.tsx
import { Header } from '@/components/shared/header'
import { Sidebar } from '@/components/shared/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}