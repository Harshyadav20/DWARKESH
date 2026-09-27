import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/auth';

/**
 * Gate for the admin area.
 *
 * Middleware runs on the Edge runtime, so it only checks that a session cookie
 * exists and redirects. The real HMAC verification happens in the admin layout
 * and in every /api/admin/* route (Node runtime), which means a forged cookie
 * never gets access — it just gets a page that then bounces to /admin/login.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(ADMIN_COOKIE)?.value);

  // The sign-in endpoint is, by definition, reachable without a session.
  if (pathname === '/api/admin/login') return NextResponse.next();

  const isLoginRoute = pathname === '/admin/login';
  const isProtectedPage = pathname.startsWith('/admin') && !isLoginRoute;
  const isProtectedApi = pathname.startsWith('/api/admin');

  if ((isProtectedPage || isProtectedApi) && !hasSession) {
    if (isProtectedApi) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
