// @@filename: src/app/(dashboard)/tickets/layout.tsx

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tickets',
  description: 'Manage your event tickets',
}

interface TicketsLayoutProps {
  children: React.ReactNode
}

export default function TicketsLayout({ children }: TicketsLayoutProps) {
  return <div className='container mx-auto px-4 py-6 lg:px-8'>{children}</div>
}
