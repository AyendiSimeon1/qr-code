// src/app/api/records/create/route.ts
export const runtime = 'edge';

export async function POST(request: Request) {
  // 1. Extract token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ message: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  const token = authHeader.slice('Bearer '.length);

  // 2. Parse and validate JSON body
  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ message: 'Invalid JSON in request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { type, ...formData } = body;
  const EXTERNAL_URL = 'https://cert.ofissainternational.com/api/new-record/';

  try {
    // 3. Forward request to external API using fetch (Edge-compatible)
    const externalRes = await fetch(EXTERNAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type, ...formData }),
    });

    const data = await externalRes.json();

    return new Response(JSON.stringify(data), {
      status: externalRes.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('External API error:', err);
    return new Response(
      JSON.stringify({ message: err.message || 'External API error' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
