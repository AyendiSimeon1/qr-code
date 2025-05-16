// src/app/api/certificate/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge';   // or 'nodejs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  }
  // fetch & proxy the image…
  const res = await fetch(url, { cache: 'force-cache' });
  const blob = await res.blob();
  return new NextResponse(blob, {
    headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream' }
  });
}
