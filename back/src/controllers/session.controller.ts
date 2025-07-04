import { Request, Response } from 'express';
import { sessionService } from '../services/session.service';

export const sessionController = {
  async requestToken(req: Request, res: Response) {
    // In a real application, you might add some rate limiting here
    // or basic checks to prevent excessive token requests.
    const token = sessionService.generateToken();
    res.json({ token });
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
