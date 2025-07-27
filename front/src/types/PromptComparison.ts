import type { Prompt } from './Prompt';

export interface PromptComparisonData {
  original: string;
  enhanced: string;
  enhancementType: Prompt['enhancementType'];
  timestamp: string;
}