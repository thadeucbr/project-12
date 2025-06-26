import axios from 'axios';
import { env } from '../config/env';

export class ClaudeProvider {
  async generate(prompt: string): Promise<string> {
    const response = await axios.post(
      `${env.CLAUDE_BASE_URL}/messages`,
      {
        model: env.CLAUDE_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
      },
      {
        headers: {
          'x-api-key': env.CLAUDE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.content[0].text;
  }
}
