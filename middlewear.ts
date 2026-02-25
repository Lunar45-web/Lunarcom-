import { NextRequest, NextResponse } from 'next/server';

/**
 * The Matcher tells Next.js which paths this middleware should run on.
 * We want to skip static files, images, and internal Next.js/Vercel paths
 * to keep the site as fast as possible.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _static (if you use a static folder)
     * - _vercel (Vercel internal routes)
     * - favicon.ico, sitemap.xml, robots.txt (common root files)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  // 1. Capture the hostname (e.g., emma.co.ke or localhost:3000)
  let hostname = req.headers.get("host") || "";

  // 2. Clean the hostname by removing "www." 
  // This ensures 'www.emma.co.ke' and 'emma.co.ke' are treated as the same site.
  hostname = hostname.replace('www.', '');

  // 3. Capture the current path (e.g., /services or /studio)
  const pathname = req.nextUrl.pathname;

  // 4. Create a new set of headers from the original request
  const requestHeaders = new Headers(req.headers);

  // 5. Inject our custom headers
  // These will be read by your layout.tsx and sanity/lib/client.ts
  requestHeaders.set('x-site-domain', hostname);
  requestHeaders.set('x-pathname', pathname);

  // 6. Return the response with the modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}