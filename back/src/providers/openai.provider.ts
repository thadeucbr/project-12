import axios from 'axios';
import { env } from '../config/env';

export class OpenAIProvider {
  async generate(prompt: string): Promise<string> {
    const response = await axios.post(
      `${env.OPENAI_BASE_URL}/chat/completions`,
      {
        model: env.OPENAI_MODEL,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content;
  }
}
