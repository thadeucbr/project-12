import { Request, Response } from 'express';
import { sessionService } from '../services/session.service';

export const sessionController = {
  async requestToken(req: Request, res: Response) {
    const token = sessionService.generateToken();
    res.cookie('sessionToken', token, {
      httpOnly: true,
      secure: true, // Forçando true para testes com HTTPS no frontend
      sameSite: 'lax', // Or 'strict' depending on your needs
      maxAge: 10 * 60 * 1000, // 10 minutes, matches token lifetime
      signed: true, // Assina o cookie com a COOKIE_SECRET
      domain: process.env.COOKIE_DOMAIN, // Define o domínio do cookie para compartilhamento entre subdomínios
    });
    res.json({ message: 'Session token set in cookie' });
  },

  // Optional: Endpoint to invalidate a token if needed (e.g., on logout)
  async invalidateToken(req: Request, res: Response) {
    const token = req.body.token; // Assuming token is sent in body for invalidation
    if (token) {
      sessionService.invalidateToken(token);
      res.status(200).json({ message: 'Token invalidated' });
    } else {
      res.status(400).json({ error: 'Token not provided' });
    }
  },
};
