
# Ayla Serverless Proxy (OpenRouter)

Two ready-to-use options are included:

## Vercel
- Function: `api/ayla.ts` (Edge runtime)
- Set env `OPENROUTER_API_KEY` and `SITE_URL` in your Vercel project.
- Client hits `/api/ayla` with `{ model, prompt, context }`.

## Netlify
- Function: `netlify/functions/ayla.ts`
- Set env `OPENROUTER_API_KEY` and `SITE_URL` in your Netlify site.
- Deploy; Netlify exposes it at `/.netlify/functions/ayla`. Either:
  - Set a redirect from `/api/ayla` → `/.netlify/functions/ayla`, or
  - Change the client baseUrl in `AylaClient` to match.

## Local dev (quick test)
- Create `.env` from `.env.sample` and add your key.
- Use `netlify dev` or `vercel dev` to run functions locally.
