import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /* Match all paths except static files, images, and api */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function proxy(req: NextRequest) {
  const hostname = req.headers.get("host")?.replace('www.', '') || "localhost:3000";
  const pathname = req.nextUrl.pathname;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-site-domain', hostname);
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}