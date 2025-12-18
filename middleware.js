import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(request) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Protect profile route
  if (pathname.startsWith('/profile')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded = verifyToken(token.value);
    if (!decoded) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // Redirect authenticated users away from login/register
  if (pathname === '/login' || pathname === '/') {
    if (token) {
      const decoded = verifyToken(token.value);
      if (decoded) {
        return NextResponse.redirect(new URL('/profile', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/profile/:path*'],
};
