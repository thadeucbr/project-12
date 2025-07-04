import { Router } from 'express';
import { sessionController } from '../controllers/session.controller';

export const sessionRoutes = Router();

sessionRoutes.post('/token', sessionController.requestToken);
// sessionRoutes.post('/invalidate', sessionController.invalidateToken); // Optional
