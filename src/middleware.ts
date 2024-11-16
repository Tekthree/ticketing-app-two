// @@filename: src/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
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
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set(name, value, options)
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set(name, value, options)
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.delete(name, options)
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.delete(name, options)
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // All dashboard routes require authentication
  const isProtectedRoute = [
    '/dashboard',
    '/tickets',
    '/analytics',
    '/events/new',
    '/events/edit',
  ].some(path => request.nextUrl.pathname.startsWith(path))

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Auth routes (when already logged in)
  if (['/login', '/register'].includes(request.nextUrl.pathname) && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tickets/:path*',
    '/analytics/:path*',
    '/events/new',
    '/events/edit/:path*',
    '/login',
    '/register',
  ],
}
