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
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Handle protected routes
  if (isProtectedRoute(request.nextUrl.pathname)) {
    if (!session) {
      // Redirect to sign in if no session
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/auth/signin'
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check email verification status
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user && !user.email_confirmed_at && !isVerificationRoute(request.nextUrl.pathname)) {
      // Redirect to verification page if email is not verified
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/auth/verify'
      redirectUrl.searchParams.set('email', user.email || '')
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Handle auth routes when user is already authenticated
  if (isAuthRoute(request.nextUrl.pathname) && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

// Check if the route is a protected route
function isProtectedRoute(pathname: string): boolean {
  const protectedPaths = [
    '/dashboard',
    '/profile',
    '/create',
  ]

  return protectedPaths.some(path => pathname.startsWith(path))
}

// Check if the route is an auth route
function isAuthRoute(pathname: string): boolean {
  const authPaths = [
    '/auth/signin',
    '/auth/signup',
  ]

  return authPaths.some(path => pathname === path)
}

// Check if the route is a verification-related route
function isVerificationRoute(pathname: string): boolean {
  const verificationPaths = [
    '/auth/verify',
    '/auth/callback',
    '/auth/auth-error',
  ]

  return verificationPaths.some(path => pathname.startsWith(path))
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}