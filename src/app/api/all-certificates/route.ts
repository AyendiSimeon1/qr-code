// app/api/certificates/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  // 1. Grab the incoming Authorization header
  const incomingAuth = request.headers.get('authorization') || '';
  console.log('Incoming Authorization Header:', incomingAuth);

  try {
    const response = await fetch('https://cert.ofissainternational.com/api/all-cert/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 2. Forward the token along
        Authorization: incomingAuth,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', message: 'Failed to fetch certificates' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Internal Server Error', error },
      { status: 500 }
    );
  }
}
