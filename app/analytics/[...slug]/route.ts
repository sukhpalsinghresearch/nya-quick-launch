import { NextRequest, NextResponse } from 'next/server';

const ANALYTICS_BACKEND_URL = process.env.ANALYTICS_BACKEND_INTERNAL_URL || 'http://127.0.0.1:8788';

async function forward(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = '/' + (slug || []).join('/');
  const targetUrl = new URL(`/analytics${path}${request.nextUrl.search}`, ANALYTICS_BACKEND_URL);

  const headers = new Headers(request.headers);
  headers.set('host', targetUrl.host);

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: 'no-store',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      const body = await request.text();
      init.body = body;
    } catch {}
  }

  try {
    const res = await fetch(targetUrl.toString(), init);
    const responseHeaders = new Headers(res.headers);
    responseHeaders.set('Cache-Control', 'no-store');

    return new NextResponse(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Analytics service unavailable', details: String(err) }, { status: 503 });
  }
}

export const GET = forward;
export const POST = forward;
export const OPTIONS = forward;
