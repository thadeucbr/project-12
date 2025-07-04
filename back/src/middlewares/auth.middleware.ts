import { Request, Response, NextFunction } from 'express';
import { sessionService } from '../services/session.service';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Excluir o endpoint de solicitação de token da autenticação
  if (req.path === '/session/token' && req.method === 'POST') {
    return next();
  }

  const sessionToken = req.signedCookies.sessionToken; // Lê o cookie assinado

  console.log('DEBUG: sessionToken do cookie:', sessionToken);
  console.log('DEBUG: Validação do token:', await sessionService.validateToken(sessionToken));

  if (!sessionToken || !(await sessionService.validateToken(sessionToken))) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing session token' });
  }

  next();
}
