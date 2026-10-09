// Optional neural read-aloud. Set OPENAI_API_KEY in Netlify; without it the app falls back to the browser voice.
export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  if (!process.env.OPENAI_API_KEY) return new Response('TTS not configured', { status: 501 });
  let body;
  try { body = await req.json(); } catch { return new Response('Bad request', { status: 400 }); }
  const { text, accent = 'UK' } = body || {};
  if (typeof text !== 'string' || !text.trim() || text.length > 1200) return new Response('Bad request', { status: 400 });

  const r = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: process.env.TTS_MODEL || 'gpt-4o-mini-tts',
      voice: process.env.TTS_VOICE || 'coral',
      input: text,
      instructions: `Read aloud for a teenage English learner (CEFR B1). ${accent === 'US' ? 'General American' : 'Standard British'} accent. Clear, warm and natural, at a calm pace, with short pauses between sentences. Pronounce each word fully.`,
      response_format: 'mp3',
    }),
  });
  if (!r.ok) return new Response('TTS error', { status: 502 });
  return new Response(await r.arrayBuffer(), { headers: { 'content-type': 'audio/mpeg', 'cache-control': 'no-store' } });
};
