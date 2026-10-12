export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const entries = body.entries || [];

  if (!entries.length) {
    return Response.json({ summary: '' });
  }

  const text = entries.map(e => e.b).join('\n');
  const prompt = '以下はユーザーの育成日記です。数行で優しい口調でまとめてください。\n\n' + text;

  if (!env.AI) {
    return Response.json({ summary: '', error: 'AI binding not configured' }, { status: 500 });
  }

  const aiRes = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
      { role: 'system', content: 'あなたはパセリっち。ユーザーの日記を優しくまとめてください。' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 150
  });

  const summary = (aiRes.response || '').trim();
  return Response.json({ summary });
}
