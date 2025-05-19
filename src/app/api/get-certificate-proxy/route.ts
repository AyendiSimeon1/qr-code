// src/app/api/get-certificate-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

// If not using NextAuth.js, you might parse cookies directly:
// import { cookies } from 'next/headers';

const THIRD_PARTY_API_BASE_URL = 'https://cert.ofissainternational.com/api/get-cert/';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  // const cert_no = searchParams.get('cert_no');
  let raw_cert_no_param = searchParams.get('cert_no'); // This will be already URL-decoded by Next.js

  if (!raw_cert_no_param) {
    return NextResponse.json({ error: 'cert_no is required' }, { status: 400 });
  }

  console.log(`Proxy received raw_cert_no_param: "[${raw_cert_no_param}]"`);

  // --- Process raw_cert_no_param to extract the actual identifier ---
  // According to your clarification: if raw_cert_no_param is like " gg" or "%20gg",
  // you only want the part after the space or "%20".

  let final_cert_no_for_api: string;

  // Scenario 1: If it's literally "%20" followed by letters (e.g., "%20gg")
  if (raw_cert_no_param.startsWith('%20')) {
    final_cert_no_for_api = raw_cert_no_param.substring(3); // Skip "%20"
  }
  // Scenario 2: If it's a space followed by letters (e.g., " gg")
  // This would happen if the client correctly sent `cert_no= gg` or if `%20` was decoded to space.
  else if (raw_cert_no_param.startsWith(' ')) {
    final_cert_no_for_api = raw_cert_no_param.trimStart().substring(0); // Trim leading space then take rest
                                                                        // or more simply: raw_cert_no_param.substring(1) if always 1 space
  }
  // Scenario 3: It's already clean (e.g., "gg")
  else {
    final_cert_no_for_api = raw_cert_no_param.trim(); // Trim just in case, but assume it's mostly clean
  }

  console.log(`Proxy determined final_cert_no_for_api: "[${final_cert_no_for_api}]"`);

  if (!final_cert_no_for_api) {
    return NextResponse.json({ error: 'Could not derive a valid cert_no for the API from the input.' }, { status: 400 });
  }


  const authToken = request.headers.get('Authorization'); // Expecting "Bearer YOUR_TOKEN_FROM_LOCALSTORAGE"
  console.log('Received Authorization Header:', authToken);
  if (!authToken) {
    // If the token is absolutely required by the third-party API
    // return NextResponse.json({ error: 'Authorization token is missing' }, { status: 401 });
    // If the third-party API might work without it or has its own auth:
    console.warn('Authorization token not provided to proxy. Requesting third-party API without it.');
  }
  // --- End Authentication Token Handling ---

  try {
    const thirdPartyApiUrl = `${THIRD_PARTY_API_BASE_URL}?cert_no=${encodeURIComponent(final_cert_no_for_api)}`;
    console.log(`Proxying request to: ${thirdPartyApiUrl} (using final_cert_no_for_api)`);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = authToken;
    }

    const apiResponse = await fetch(thirdPartyApiUrl, {
      method: 'GET',
      headers: headers,
    });

    if (!apiResponse.ok) {
      let errorBody = `Third-party API responded with status: ${apiResponse.status}`;
      try {
        const thirdPartyError = await apiResponse.json();
        errorBody += ` - ${JSON.stringify(thirdPartyError)}`;
      } catch (e) {
        const textError = await apiResponse.text(); // Defensive: if error body isn't JSON
        errorBody += ` - Body: ${textError || '(empty body)'}`;
      }
      console.error(errorBody);
      return NextResponse.json({ error: `Failed to fetch data from external API. Status: ${apiResponse.status}`, details: errorBody }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error('Error in proxy API route:', error);
    return NextResponse.json({ error: 'Internal server error in proxy.', details: error.message }, { status: 500 });
  }
}