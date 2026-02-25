import { NextRequest, NextResponse } from 'next/server';

// This tells Next.js which paths the middleware should run on.
// We exclude static files, images, and API routes to keep your site blazing fast.
export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  // 1. Get the hostname from the request headers
  let hostname = req.headers.get("host")!;

  // 2. Clean up the hostname (remove "www." so "www.emma.co.ke" becomes "emma.co.ke")
  // This ensures your Sanity query always matches perfectly.
  hostname = hostname.replace('www.', '');

  // 3. Create a new set of headers and inject our cleaned-up domain
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-site-domain', hostname);

  // 4. Pass the modified headers to the Next.js App Router
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}