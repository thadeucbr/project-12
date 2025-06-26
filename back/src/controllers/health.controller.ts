import { Request, Response } from 'express';
import { getActiveProviders, getProvider } from '../providers/provider.factory';

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Healthcheck da API e dos provedores LLM
 *     tags:
 *       - Health
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Status dos provedores e da API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 providers:
 *                   type: object
 *                 timestamp:
 *                   type: string
 */
export const healthController = {
  async handle(req: Request, res: Response) {
    const providers = getActiveProviders();
    const results: Record<string, boolean> = {};
    await Promise.all(
      providers.map(async (provider) => {
        try {
          // Testa provider com prompt simples
          await getProvider(provider).generate('ping');
          results[provider] = true;
        } catch {
          results[provider] = false;
        }
      })
    );
    res.json({
      status: 'ok',
      providers: results,
      timestamp: new Date().toISOString(),
    });
  },
};
