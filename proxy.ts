import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js 16 Proxy Configuration
 */
export const config = {
  matcher: [
    /*
     * Intercept all routes except:
     * - api, _next, _static, _vercel
     * - static files (images, icons, etc.)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function proxy(req: NextRequest) {
  const hostname = req.headers.get("host")?.replace('www.', '') || "localhost:3000";
  const pathname = req.nextUrl.pathname;

  const requestHeaders = new Headers(req.headers);
  
  // Injecting the custom headers our Layout needs
  requestHeaders.set('x-site-domain', hostname);
  requestHeaders.set('x-pathname', pathname);

  // In Next.js 16, we return NextResponse.next() to pass control to the page
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}