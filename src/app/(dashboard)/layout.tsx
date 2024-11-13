import { Header } from '@/components/shared/header'
import { Sidebar } from '@/components/shared/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='min-h-screen bg-gray-100'>
      <Header />
      <div className='flex'>
        <Sidebar />
        <main className='flex-1 p-8'>{children}</main>
      </div>
    </div>
  )
}
