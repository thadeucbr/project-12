import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AnalyticsRequestDto } from '../dtos/analytics.dto';
import { analyticsService } from '../services/analytics.service';

/**
 * @swagger
 * /analytics/track:
 *   post:
 *     summary: Rastreia um evento de análise
 *     tags:
 *       - Analytics
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnalyticsRequestDto'
 *     responses:
 *       200:
 *         description: Evento rastreado com sucesso
 *       400:
 *         description: Entrada inválida
 *       500:
 *         description: Erro interno
 *
 * /analytics/stats:
 *   get:
 *     summary: Obtém estatísticas de análise
 *     tags:
 *       - Analytics
 *     responses:
 *       200:
 *         description: Estatísticas de análise
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalAccesses:
 *                   type: integer
 *                 todayAccesses:
 *                   type: integer
 *                 totalPrompts:
 *                   type: integer
 *                 enhancementTypes:
 *                   type: object
 *       500:
 *         description: Erro interno
 */
export const analyticsController = {
  async track(req: Request, res: Response) {
    const dto = plainToInstance(AnalyticsRequestDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Invalid input', details: errors });
    }
    try {
      await analyticsService.track(dto);
      res.status(200).json({ message: 'ok' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getStats(req: Request, res: Response) {
    try {
      const stats = await analyticsService.getStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
};