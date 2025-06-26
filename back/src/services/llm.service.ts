import { getProvider, getActiveProviders } from '../providers/provider.factory';
import { LLMProvider } from '../types/llm';

export class LLMService {
  async generate(prompt: string, provider?: LLMProvider) {
    const activeProviders = getActiveProviders();
    const selectedProvider = provider && activeProviders.includes(provider)
      ? provider
      : activeProviders[0];
    const providerInstance = getProvider(selectedProvider);
    const output = await providerInstance.generate(prompt);
    return { provider: selectedProvider, output };
  }
}

export const llmService = new LLMService();
