import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import crypto from 'crypto';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.header('x-api-key');
  const signature = req.header('x-signature');
  const timestamp = req.header('x-timestamp');

  if (!apiKey || !env.API_KEYS.includes(apiKey)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!signature || !timestamp) {
    return res.status(400).json({ error: 'Missing signature or timestamp' });
  }

  const payload = `${req.method}:${req.originalUrl}:${timestamp}`;
  const expectedSignature = crypto
    .createHmac('sha256', env.PRIVATE_KEY)
    .update(payload)
    .digest('hex');

  console.log('Back-End Signature Validation:', {
    payload,
    expectedSignature,
    receivedSignature: signature,
    privateKey: env.PRIVATE_KEY,
  });

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  next();
}
