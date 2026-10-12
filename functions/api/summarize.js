export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const entries = body.entries || [];

  if (!entries.length) {
    return new Response(JSON.stringify({summary: ''}), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const text = entries.map(e => e.b).join('\n');
  const prompt = '以下はユーザーの育成日記です。数行で優しい口調でまとめてください。\n\n' + text;

  const openrouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://parsleecchi.pages.dev',
      'X-Title': 'Parsleecchi'
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: [{role: 'user', content: prompt}],
      max_tokens: 150
    })
  });

  if (!openrouterRes.ok) {
    const errText = await openrouterRes.text();
    return new Response(JSON.stringify({summary: '', error: errText}), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const data = await openrouterRes.json();
  const summary = data.choices?.[0]?.message?.content || '';

  return new Response(JSON.stringify({summary}), {
    headers: { 'Content-Type': 'application/json' }
  });
}
