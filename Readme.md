# Hedging Platform (Backend)

Express + TypeScript backend API for the Oilseed Hedging Platform.

## What it provides

- Auth endpoints (OTP flow)
- Hedge / farmer / contracts / PIN APIs
- MongoDB persistence (Mongoose)
- Optional blockchain interactions (Ethers)

## Requirements

- Node.js (LTS recommended)
- npm
- A MongoDB connection string (local or Atlas)

## Setup

From `c:\Collab\Oilseed\hedging-platform-backend`:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build + run production:

```bash
npm run build
npm start
```

## Environment variables

These are read from `process.env` (via `dotenv` in local dev):

- **`PORT`**: server port (default `3000` if unset)
- **`DATABASE_URL`**: MongoDB connection string
- **`JWT_SECRET`**: JWT signing secret
- **`RPC_URL`**: Ethereum RPC URL (if using blockchain features)
- **`CONTRACT_ADDRESS`**: deployed contract address
- **`PRIVATE_KEY`**: server wallet private key (hex string, `0x` + 64 hex chars)
- **`BUYER_PRIVATE_KEY`**: buyer wallet private key (same format)

Important for Render/production:

- Ensure `PRIVATE_KEY` / `BUYER_PRIVATE_KEY` have **no spaces/newlines**. Ethers will crash on startup if the key contains whitespace.

## API base path

All routes are mounted under `/api/v1`:

- `/api/v1/auth`
- `/api/v1/hedge`
- `/api/v1/contracts`
- `/api/v1/farmer`
- `/api/v1/pin`

## CORS

If your frontend runs on Vite (e.g. `http://localhost:5174`), the backend must explicitly allow that origin and respond to preflight `OPTIONS` requests.

The CORS allowlist is configured in `src/index.ts` via `allowedOrigins`.

## Deploying on Render

Recommended Render settings:

- **Build command**: `npm run build`
- **Start command**: `npm start` (runs `node dist/index.js`)
- Configure env vars in Render dashboard (do not rely on `.env` in production).

If the service crashes at startup, CORS will never be applied and the frontend will report CORS/network errors.
