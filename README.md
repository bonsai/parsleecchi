# サービス パセリっち

話しかけると育つ育成日記。あなたの言葉が葉っぱになる。

## Deploy to Cloudflare Pages

1. GitHub repository settings → Secrets and variables → Actions
2. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
3. Push to `main` branch → GitHub Action auto-deploys `public/` to Cloudflare Pages

## Development

- Frontend: `public/index.html` (static SPA)
- Backend: FastAPI (see issues for progress)
- Database: PostgreSQL (see issues for schema)

## Issues

- #1 p5.js もしゃもしゃパセリレンダリング
- #2 Deepgram Voice Agent WebSocket 中継
- #3 PostgreSQL スキーマ & 有料サブスク（Stripe）
- #4 音声日記: transcript / mood / eval & feed
- #5 Cloudflare デプロイ
- #6 REST API 完成 & フロント連携（state / talk / diary）
