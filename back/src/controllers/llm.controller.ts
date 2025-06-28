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
      
      // Limpa a resposta para remover possíveis instruções ou formatação desnecessária
      let cleanedOutput = result.output;
      
      // Remove possíveis prefixos de instrução que podem ter vazado
      const instructionPrefixes = [
        'Enhanced prompt:',
        'Enhanced image prompt:',
        'Enhanced video prompt:',
        'Prompt aprimorado:',
        'Resultado:',
        'Output:',
        'Response:',
        'Here is the enhanced prompt:',
        'Here\'s the enhanced prompt:',
        'The enhanced prompt is:',
        'Enhanced version:'
      ];
      
      for (const prefix of instructionPrefixes) {
        if (cleanedOutput.toLowerCase().startsWith(prefix.toLowerCase())) {
          cleanedOutput = cleanedOutput.substring(prefix.length).trim();
        }
      }
      
      // Remove aspas desnecessárias no início e fim
      cleanedOutput = cleanedOutput.replace(/^["']|["']$/g, '');
      
      // Remove quebras de linha excessivas
      cleanedOutput = cleanedOutput.replace(/\n{3,}/g, '\n\n');
      
      res.json({
        provider: result.provider,
        output: cleanedOutput.trim()
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
};