import { Request, Response, NextFunction } from 'express';

export function cloudflareAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  // Verifica se o cabeçalho CF-RAY está presente
  if (!req.headers['cf-ray']) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}
