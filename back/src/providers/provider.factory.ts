import { env } from '../config/env';
import { OpenAIProvider } from './openai.provider';
import { GeminiProvider } from './gemini.provider';
import { ClaudeProvider } from './claude.provider';
import { OllamaProvider } from './ollama.provider';
import { LLMProvider } from '../types/llm';

export function getProvider(provider: LLMProvider) {
  switch (provider) {
    case 'openai':
      return new OpenAIProvider();
    case 'gemini':
      return new GeminiProvider();
    case 'claude':
      return new ClaudeProvider();
    case 'ollama':
      return new OllamaProvider();
    default:
      throw new Error('Provider not supported');
  }
}

export function getActiveProviders(): LLMProvider[] {
  return env.LLM_PROVIDERS as LLMProvider[];
}
