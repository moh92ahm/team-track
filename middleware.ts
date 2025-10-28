// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('payload-token')?.value
  const path = req.nextUrl.pathname

  // Allow Payload admin panel & API, login page, signup, and static assets
  if (
    path.startsWith('/admin') ||
    path.startsWith('/api') ||
    path.startsWith('/login') ||
    path.startsWith('/signup') ||
    path.startsWith('/_next') ||
    path.startsWith('/static') ||
    path === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Optionally verify the token with Payload (more secure but slower)
  try {
    const verifyResponse = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/users/me`,
      {
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      },
    )

    if (!verifyResponse.ok) {
      // Token is invalid, redirect to login
      const response = NextResponse.redirect(new URL('/login', req.url))
      response.cookies.delete('payload-token')
      return response
    }

    const userData = await verifyResponse.json()
    const user = userData.user

    // Check if user is super admin or has admin permissions
    const isSuperAdmin = user.isSuperAdmin === true
    const hasAdminPermissions = user.role?.permissions?.users?.viewAll === true
    const isBasicEmployee = !isSuperAdmin && !hasAdminPermissions

    // Basic employees trying to access dashboard should go to profile
    if (isBasicEmployee && path === '/') {
      return NextResponse.redirect(new URL('/profile', req.url))
    }

    // Super admins and admins trying to access employee profile should go to dashboard
    if (!isBasicEmployee && path.startsWith('/profile')) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  } catch (error) {
    // If verification fails, allow through but log the error
    console.log('Token verification failed:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!api|admin|_next|static|favicon.ico|login).*)'],
}
