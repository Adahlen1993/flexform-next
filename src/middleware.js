import { NextResponse } from 'next/server'

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|login|register).*)'],
}

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded
  } catch (err) {
    console.error('Token decode failed:', err)
    return null
  }
}

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  console.log('Middleware token:', token)

  const user = token ? decodeToken(token) : null
  const isExpired = user?.exp && Date.now() >= user.exp * 1000

  if (!user || isExpired) {
    console.log('Invalid or expired token')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
