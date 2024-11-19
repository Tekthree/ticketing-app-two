// @@filename: src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { type Database } from './types'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options) {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
              // Ensure secure defaults
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              priority: 'high', // New option from docs
            })
          } catch (error) {
            console.warn('Cookie set error:', error)
          }
        },
        remove(name: string, options) {
          try {
            // Using the new clear method if no specific name
            if (!name) {
              cookieStore.clear()
              return
            }
            cookieStore.delete(name)
          } catch (error) {
            console.warn('Cookie remove error:', error)
          }
        },
      },
    }
  )
}