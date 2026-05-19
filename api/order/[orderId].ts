import type {VercelRequest, VercelResponse} from '@vercel/node';
import {processOrderLookup} from '../../server/fruitfy-handlers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.status(204).setHeader('Allow', 'GET, OPTIONS').end();
    return;
  }
  if (req.method !== 'GET') {
    res.status(405).setHeader('Allow', 'GET, OPTIONS').json({
      success: false,
      message: 'Method Not Allowed',
    });
    return;
  }

  const orderId = typeof req.query.orderId === 'string' ? req.query.orderId : undefined;
  const result = await processOrderLookup(orderId);
  for (const [k, v] of Object.entries(result.headers)) {
    if (v) res.setHeader(k, v);
  }
  res.status(result.statusCode).send(result.body);
}
