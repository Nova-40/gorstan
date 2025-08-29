
// Minimal /api/ayla proxy for Vercel/Netlify
// This version echoes back a simple response for now.
// Replace with provider-specific fetch (OpenRouter, Groq, etc.) as needed.

export default async function handler(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const prompt: string = body.prompt || '';
    const context = body.context || {};
    const msg = `Echo Ayla: ${prompt.substring(0, 60)}... (ctx rooms: ${context.room})`;
    return new Response(msg, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      status: 200
    });
  } catch (e: any) {
    return new Response('Ayla proxy error: ' + e.message, { status: 500 });
  }
}
