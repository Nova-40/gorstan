
// Vercel serverless function wrapper
import { aylaHandler } from '../serverless/ayla-common';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const body = await req.json();
  return aylaHandler(body);
}
