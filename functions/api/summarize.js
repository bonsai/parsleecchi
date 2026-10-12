const CF_ACCOUNT_ID = '290e65605de6f2b8a5f61dbfaa36e28c';
const MODEL = '@cf/meta/llama-3.1-8b-instruct';

export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const entries = body.entries || [];

  if (!entries.length) {
    return Response.json({ summary: '' });
  }

  const text = entries.map(e => e.b).join('\n');
  const prompt = '以下はユーザーの育成日記です。数行で優しい口調でまとめてください。\n\n' + text;

  const aiRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${MODEL}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.CF_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'あなたはパセリっち。ユーザーの日記を優しくまとめてください。' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 150
      })
    }
  );

  if (!aiRes.ok) {
    const errText = await aiRes.text().catch(() => '');
    return Response.json({ summary: '', error: errText }, { status: 502 });
  }

  const data = await aiRes.json();
  const summary = (data.result?.response || '').trim();
  return Response.json({ summary });
}
