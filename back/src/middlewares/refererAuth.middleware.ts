import { Request, Response, NextFunction } from 'express';

export function refererAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const referer = req.headers.referer;

  // Permite requisições se o referer for do seu frontend
  // ou se o referer não estiver presente (para compatibilidade com algumas ferramentas/cenários)
  if (!referer || referer.includes('https://prompts.barbudas.com')) {
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden: Invalid Referer header' });
  }
}
