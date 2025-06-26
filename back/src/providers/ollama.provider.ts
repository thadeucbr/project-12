import axios from 'axios';
import { env } from '../config/env';

export class OllamaProvider {
  async generate(prompt: string): Promise<string> {
    const response = await axios.post(
      `${env.OLLAMA_BASE_URL}/api/generate`,
      {
        model: env.OLLAMA_MODEL,
        prompt,
      }
    );
    return response.data.response;
  }
}
