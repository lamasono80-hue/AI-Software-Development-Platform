import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define route lists
  const publicRoutes = ['/', '/about', '/login', '/register'];
  const protectedRoutes = ['/dashboard', '/chat', '/projects', '/documents', '/history', '/profile', '/settings', '/admin'];

  // Check auth tokens / cookies
  const hasSupabaseToken = request.cookies.has('sb-access-token') || request.cookies.has('supabase-auth-token');
  const hasDemoToken = request.cookies.has('devpilot_user');
  
  // Note: LocalStorage is client-side, middleware checks cookies or header indicators
  // For client-side route guards, we also handle in layout/pages.

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
