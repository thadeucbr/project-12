import { Router } from 'express';
import { sessionController } from '../controllers/session.controller';
import { tokenRateLimitMiddleware } from '../middlewares/tokenRateLimit.middleware';

export const sessionRoutes = Router();

sessionRoutes.post('/token', tokenRateLimitMiddleware, sessionController.requestToken);
// sessionRoutes.post('/invalidate', sessionController.invalidateToken); // Optional
