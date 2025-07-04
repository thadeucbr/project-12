import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';

export const analyticsRoutes = Router();

analyticsRoutes.post('/track', analyticsController.track);
analyticsRoutes.get('/stats', analyticsController.getStats);
