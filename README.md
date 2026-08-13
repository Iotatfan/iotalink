# Iotalink

Iotalink is a Next.js URL shortener frontend. It uses the App Router and forwards shortening and redirect requests to the API configured by `NEXT_PUBLIC_API_BASE_URL`.

## Development

Create `.env.local` with:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.iotatfan.com
```

Then run:

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run build
npm run start
```
