import axios from 'axios';
import { env } from '../config/env';

export class GeminiProvider {
  async generate(prompt: string): Promise<string> {
    const response = await axios.post(
      `${env.GEMINI_BASE_URL}/models/${env.GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );
    return response.data.candidates[0].content.parts[0].text;
  }
}
