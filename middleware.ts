// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('payload-token')?.value
  const path = req.nextUrl.pathname

  // Allow Payload admin panel & API, login page, and static assets
  if (
    path.startsWith('/admin') ||
    path.startsWith('/api') ||
    path.startsWith('/login') ||
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
