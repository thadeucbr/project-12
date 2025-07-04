import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     AnalyticsRequestDto:
 *       type: object
 *       properties:
 *         ip:
 *           type: string
 *           description: O endereço IP do usuário.
 *         prompt:
 *           type: string
 *           description: O prompt que foi aprimorado.
 *         enhancementType:
 *           type: string
 *           description: O tipo de aprimoramento utilizado.
 */
export class AnalyticsRequestDto {
  @IsString()
  @IsNotEmpty()
  ip!: string;

  @IsString()
  @IsOptional()
  prompt?: string;

  @IsString()
  @IsOptional()
  enhancementType?: string;
}