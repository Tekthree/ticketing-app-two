// @@filename: src/lib/actions/auth.ts
'use server'

import { cookies } from 'next/headers'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signOut() {
  const cookieStore = await cookies()
  const supabase = await createServerSupabaseClient()
  
  await supabase.auth.signOut()
  
  // Clear all auth related cookies
  cookieStore.clear()
  
  redirect('/login')
}

export async function updateSession(session: any) {
  const cookieStore = await cookies()
  
  if (!session) {
    // Clear session-related cookies
    const authCookies = cookieStore.getAll()
      .filter(cookie => cookie.name.startsWith('sb-'))
    
    authCookies.forEach(cookie => {
      cookieStore.delete(cookie.name)
    })
    return
  }

  // Set session cookies with proper options
  cookieStore.set({
    name: 'session',
    value: JSON.stringify(session),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    priority: 'high',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}