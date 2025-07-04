import { Request, Response, NextFunction } from 'express';
import { sessionService } from '../services/session.service';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Excluir o endpoint de solicitação de token da autenticação
  if (req.path === '/session/token' && req.method === 'POST') {
    return next();
  }

  const sessionToken = req.header('x-session-token');

  if (!sessionToken || !sessionService.validateToken(sessionToken)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing session token' });
  }

  next();
}
