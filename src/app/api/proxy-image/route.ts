
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
  
    if (!url) {
      return new Response(JSON.stringify({ error: 'Missing image URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    try {
      // Fetch the image from the external URL
      const response = await fetch(url);
  
      if (!response.ok) {
        // Handle non-200 responses from the external server
         return new Response(JSON.stringify({ error: `Failed to fetch image: ${response.statusText}` }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      // Determine the content type from the response headers
      const contentType = response.headers.get('content-type') || 'application/octet-stream'; // Default if none provided
      const cacheControl = response.headers.get('cache-control') || 'public, max-age=31536000, immutable'; // Default cache
  
  
      // Return the image data as a Response
      return new Response(response.body, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': cacheControl,
        },
      });
  
    } catch (error) {
      console.error('Proxy image error:', error);
       return new Response(JSON.stringify({ error: 'Internal server error fetching image' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }