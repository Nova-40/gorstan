
/**
 * Ayla serverless handler (common logic).
 * Provider: OpenRouter (default). Non-streaming to keep infra simple.
 */
export type AylaIncoming = {
  model?: 'fast' | 'smart',
  prompt: string,
  context?: any,
  system?: string
}

export async function aylaHandler(body: AylaIncoming): Promise<Response> {
  const provider = process.env.AYLA_PROVIDER || 'openrouter';
  if (provider !== 'openrouter') {
    return new Response('Only openrouter is wired in this stub.', { status: 501 });
  }
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return new Response('Missing OPENROUTER_API_KEY', { status: 500 });
  const model = body.model === 'fast' ? 'qwen/qwen-2.5-7b-instruct:free' : 'anthropic/claude-3.5-sonnet';
  const messages = [
    body.system ? { role: 'system', content: body.system } : null,
    { role: 'user', content: JSON.stringify({ prompt: body.prompt, context: body.context || {} })}
  ].filter(Boolean);

  const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.SITE_URL || 'https://example.com',
      'X-Title': 'Gorstan Ayla'
    },
    body: JSON.stringify({ model, messages, stream: false })
  });
  if (!resp.ok) {
    const t = await resp.text();
    return new Response(`Provider error: ${resp.status} ${t}`, { status: 500 });
  }
  const data = await resp.json();
  const text = data?.choices?.[0]?.message?.content || '';
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' }});
}
