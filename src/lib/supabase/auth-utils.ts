// @@filename: src/lib/supabase/auth-utils.ts
import { headers } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { Database } from './types'

export async function getServerSession() {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      headers: {
        get(name: string) {
          return headers().get(name)
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}
