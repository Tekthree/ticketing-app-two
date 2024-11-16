// @@filename: src/lib/utils.ts

   import { type ClassValue, clsx } from 'clsx'
   import { twMerge } from 'tailwind-merge'

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs))
   }

   export function formatDate(date: string | Date) {
     return new Intl.DateTimeFormat('en-US', {
       month: 'long',
       day: 'numeric',
       year: 'numeric',
       hour: 'numeric',
       minute: 'numeric',
       hour12: true,
     }).format(new Date(date))
   }

   export function formatCurrency(price: number) {
     return new Intl.NumberFormat('en-US', {
       style: 'currency',
       currency: 'USD',
       minimumFractionDigits: 2,
     }).format(price)
   }