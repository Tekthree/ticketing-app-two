// @@filename: src/config/navigation.ts
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  BarChart,
  Settings,
  User,
} from 'lucide-react'

// Main navigation items (public)
export const mainNav = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Explore',
    href: '/explore',
  },
  {
    title: 'My Tickets',
    href: '/tickets',
  },
]

// Dashboard sidebar navigation (private)
export const dashboardNav = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'My Events',
    href: '/dashboard/events',
    icon: Calendar,
  },
  {
    title: 'My Tickets',
    href: '/tickets',
    icon: Ticket,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart,
  },
]

// User account dropdown navigation
export const userNav = [
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]