import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LLMRequestDto } from '../dtos/llm.dto';
import { llmService } from '../services/llm.service';

/**
 * @swagger
 * /llm:
 *   post:
 *     summary: Gera resposta de LLM
 *     tags:
 *       - LLM
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LLMRequestDto'
 *     responses:
 *       200:
 *         description: Resposta do modelo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 provider:
 *                   type: string
 *                 output:
 *                   type: string
 *       400:
 *         description: Entrada inválida
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 */
export const llmController = {
  async handle(req: Request, res: Response) {
    const dto = plainToInstance(LLMRequestDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Invalid input', details: errors });
    }
    try {
      const { prompt, provider } = dto;
      const result = await llmService.generate(prompt, provider as any);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
};
