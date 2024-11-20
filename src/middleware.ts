// @@filename: src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          // Set cookie with all available options from docs
          response.cookies.set({
            name,
            value,
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            priority: 'high',
          })
        },
        remove(name: string, options) {
          response.cookies.delete({
            name,
            ...options,
            path: '/',
          })
        },
      },
    }
  )

  // Refresh session if needed
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes handling
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
  const isProtectedRoute = [
  '/dashboard', 
  '/dashboard/events',    // Add this
  '/dashboard/tickets',   // Add this
  '/tickets', 
  '/analytics', 
  '/events/new'
].some(path => request.nextUrl.pathname.startsWith(path))

  if (isProtectedRoute && !session) {
    // Store the attempted URL
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthRoute && session) {
    // Get the intended destination or default to dashboard
    const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/dashboard'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public directory
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}