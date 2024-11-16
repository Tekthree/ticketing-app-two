// @@filename: src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        set(name: string, value: string, options) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // Handle cookie errors in development
            console.error('Cookie set error:', error)
          }
        },
        remove(name: string, options) {
          try {
            cookieStore.delete(name, options)
          } catch (error) {
            console.error('Cookie remove error:', error)
          }
        }
      }
    }
  )
}