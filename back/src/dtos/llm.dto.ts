import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     LLMRequestDto:
 *       type: object
 *       properties:
 *         prompt:
 *           type: string
 *           example: "Explique o que é IA"
 *         provider:
 *           type: string
 *           enum: [openai, gemini, claude, ollama]
 *           example: "openai"
 *       required:
 *         - prompt
 */

export class LLMRequestDto {
  @IsString()
  @IsNotEmpty()
  prompt!: string;

  @IsString()
  @IsOptional()
  @IsIn(['openai', 'gemini', 'claude', 'ollama'])
  provider?: string;
}
