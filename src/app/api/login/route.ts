import axios from 'axios';

export const runtime = 'edge';
const apiKey = process.env.API_KEY || '13db0a2eda129aa67f8b2c60e175e1fd';


export async function POST(request: Request) {
  const raw = await request.text();
  let body: { email: string; password: string };
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response(JSON.stringify({ message: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { email, password } = body;
  if (!email || !password) {
    return new Response(JSON.stringify({ message: 'Email and password are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const API_KEY = process.env.API_KEY || '13db0a2eda129aa67f8b2c60e175e1fd';
  try {
    // try POST first
    const { data } = await axios.post(
      'https://cert.ofissainternational.com/api/login/',
      { email, password },
      { headers: { 'Content-Type': 'application/json', 'api-key': API_KEY } }
    );
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    // fallback to GET
    const { data } = await axios.get(
      'https://cert.ofissainternational.com/api/login/',
      { params: { email, password }, headers: { 'api-key': API_KEY } }
    );
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
