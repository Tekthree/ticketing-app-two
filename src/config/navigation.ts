// @@filename: src/config/navigation.ts
import { LayoutDashboard, Calendar, Ticket, BarChart } from 'lucide-react'

export const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Tickets', href: '/tickets', icon: Ticket },
  { name: 'Analytics', href: '/analytics', icon: BarChart },
]
