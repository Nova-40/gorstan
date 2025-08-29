
import type { Handler } from '@netlify/functions';
import { aylaHandler } from '../../serverless/ayla-common';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const body = event.body ? JSON.parse(event.body) : {};
  const res = await aylaHandler(body);
  const text = await res.text();
  return { statusCode: res.status, body: text, headers: { 'Content-Type': 'text/plain; charset=utf-8' } };
};
