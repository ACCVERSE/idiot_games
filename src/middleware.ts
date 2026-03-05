import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Pass through all requests - no auth required for this app
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Only match specific paths that need middleware, excluding API and static files
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
