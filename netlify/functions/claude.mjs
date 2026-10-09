// Server-side proxy: the API key lives in Netlify (env var ANTHROPIC_API_KEY), never in the browser.
export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  let body;
  try { body = await req.json(); } catch { return new Response('Bad request', { status: 400 }); }
  const { prompt, max_tokens = 700 } = body || {};
  if (typeof prompt !== 'string' || !prompt || prompt.length > 10000) return new Response('Bad request', { status: 400 });

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5',
      max_tokens: Math.min(Number(max_tokens) || 700, 4000),
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await r.json();
  if (!r.ok) return Response.json({ error: data?.error?.message || 'API error' }, { status: 502 });
  return Response.json({ text: (data.content || []).map((c) => c.text || '').join('') });
};
