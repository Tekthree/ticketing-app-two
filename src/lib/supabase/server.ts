// @@filename: src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

export async function createServerSupabaseClient() {
  const cookieStore = cookies()

  const allCookies = await cookieStore.getAll()
  const transformedCookies = allCookies.map(cookie => ({
    name: cookie.name,
    value: cookie.value,
  }))

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => transformedCookies,
        async setAll(cookies: Record<string, string>, options?: CookieOptions) {
          for (const [name, value] of Object.entries(cookies)) {
            cookieStore.set({ name, value, ...options })
          }
        },
      },
    }
  )
}
