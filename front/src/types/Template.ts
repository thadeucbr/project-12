import type { Prompt } from './Prompt';

export interface Template {
  prompt: string;
  enhancementType: Prompt['enhancementType'];
  // Adicione outras propriedades do template se existirem
}