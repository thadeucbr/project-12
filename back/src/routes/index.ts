import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { llmController } from '../controllers/llm.controller';
import { healthController } from '../controllers/health.controller';
import { analyticsRoutes } from './analytics.routes';

export const routes = Router();

routes.use(authMiddleware);

routes.post('/llm', llmController.handle);
routes.get('/health', healthController.handle);
routes.use('/analytics', analyticsRoutes);
