// Server-side AI proxy: API keys live in Netlify environment variables, never in the browser.
// Uses Groq (free tier) when GROQ_API_KEY is set; otherwise Anthropic if ANTHROPIC_API_KEY is set.
export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  let body;
  try { body = await req.json(); } catch { return new Response('Bad request', { status: 400 }); }
  const { prompt, max_tokens = 700 } = body || {};
  if (typeof prompt !== 'string' || !prompt || prompt.length > 10000) return new Response('Bad request', { status: 400 });
  const maxTokens = Math.min(Number(max_tokens) || 700, 4000);

  try {
    if (process.env.GROQ_API_KEY) {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          max_tokens: maxTokens,
          temperature: 0.7,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await r.json();
      if (!r.ok) return Response.json({ error: data?.error?.message || 'API error' }, { status: r.status === 429 ? 429 : 502 });
      return Response.json({ text: data?.choices?.[0]?.message?.content || '' });
    }

    if (process.env.ANTHROPIC_API_KEY) {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5',
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await r.json();
      if (!r.ok) return Response.json({ error: data?.error?.message || 'API error' }, { status: r.status === 429 ? 429 : 502 });
      return Response.json({ text: (data.content || []).map((c) => c.text || '').join('') });
    }

    return Response.json({ error: 'No AI key configured (set GROQ_API_KEY in Netlify)' }, { status: 503 });
  } catch (e) {
    return Response.json({ error: 'AI service unreachable' }, { status: 502 });
  }
};
