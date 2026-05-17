# AI Escape Room — Setup Guide

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- A [Google Gemini API key](https://aistudio.google.com/apikey)

## 1. Install dependencies

```bash
npm install
```

If `npm install` fails with SSL errors on your network:

```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'; npm install
```

## 2. Configure environment variables

Copy the example env file and add your API key:

```bash
copy .env.example .env
```

Edit `.env`:

```env
GOOGLE_API_KEY=your_actual_api_key_here
PORT=3001
```

The API key is read **only by the backend server** — it is never sent to the browser.

## 3. Run the app (development)

Start both the React frontend and the Gemini API server:

```bash
npm run dev
```

- **Frontend:** http://localhost:5173  
- **API server:** http://localhost:3001  

Vite proxies `/api/*` requests to the backend automatically.

## 4. Production build

```bash
npm run build
npm start
```

Open http://localhost:3001 — the API server serves the built frontend and handles Gemini requests.

## How it works

| Endpoint | Purpose |
|----------|---------|
| `GET /api/health` | Check API key configuration |
| `POST /api/game/start` | Generate level 1 opening scene |
| `POST /api/game/chat` | Narrator response + puzzle progress |
| `POST /api/game/hint` | Dynamic hint for current puzzle |

Gemini acts as a cyberpunk escape room narrator, maintaining story continuity from chat history. If the API is unavailable, the app falls back to built-in puzzle responses.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `GOOGLE_API_KEY is not set` | Create `.env` with your key |
| Chat uses backup narrator | Ensure `npm run dev` started **both** client and API (use `npm run dev`, not only `vite`) |
| CORS / network errors | Confirm API is on port 3001 and proxy is active |
| Rate limits | Wait a moment and retry; use `gemini-2.0-flash` (default) |
