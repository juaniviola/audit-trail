import { NextRequest, NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

const internalApiUrl = process.env.INTERNAL_API_URL || 'http://127.0.0.1:5000';

const methodsWithBody = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

async function proxy(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const target = new URL(`/v1/${path.map(encodeURIComponent).join('/')}`, internalApiUrl);

  request.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.append(key, value);
  });

  const headers = new Headers(request.headers);
  headers.delete('connection');
  headers.delete('content-length');
  headers.delete('host');

  const response = await fetch(target, {
    method: request.method,
    headers,
    body: methodsWithBody.has(request.method) ? await request.arrayBuffer() : undefined,
    redirect: 'manual',
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;

