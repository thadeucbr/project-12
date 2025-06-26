export type LLMProvider = 'openai' | 'gemini' | 'claude' | 'ollama';

export interface LLMResponse {
  provider: LLMProvider;
  output: string;
  [key: string]: any;
}
