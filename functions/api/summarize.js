const MODEL = '@cf/meta/llama-3.2-3b-instruct';

export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const entries = body.entries || [];

  if (!entries.length) {
    return Response.json({ summary: '' });
  }

  const text = entries.map(e => e.b).join('\n');
  const prompt = '以下はユーザーの育成日記です。数行で優しい口調でまとめてください。\n\n' + text;

  try {
    const aiRes = await env.AI.run(MODEL, {
      messages: [
        { role: 'system', content: 'あなたはパセリっち。ユーザーの日記を優しくまとめてください。' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 150
    });
    const summary = (aiRes?.response || '').trim();
    return Response.json({ summary });
  } catch (e) {
    return Response.json({ summary: '', error: e.message || String(e) }, { status: 500 });
  }
}
