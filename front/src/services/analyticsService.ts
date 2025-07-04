interface AnalyticsData {
  totalAccesses: number;
  todayAccesses: number;
  totalPrompts: number;
  enhancementTypes: Record<string, number>;
}

interface AnalyticsRequest {
  ip: string;
  prompt?: string;
  enhancementType?: string;
}

class AnalyticsService {
  private baseUrl: string;
  private apiKey: string;
  private privateKey: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    this.apiKey = import.meta.env.VITE_API_KEY || '';
    this.privateKey = import.meta.env.VITE_PRIVATE_KEY || '';
  }

  private async generateSignature(method: string, url: string): Promise<{ signature: string; timestamp: string }> {
    const timestamp = new Date().toISOString();
    const apiUrl = `/api${url}`;
    const payload = `${method}:${apiUrl}:${timestamp}`;
    const encoder = new TextEncoder();
    const privateKey = encoder.encode(this.privateKey);

    const key = await window.crypto.subtle.importKey(
      'raw',
      privateKey,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await window.crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const signature = Array.from(new Uint8Array(signatureBuffer))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');

    return { signature, timestamp };
  }

  async trackAccess(data: AnalyticsRequest): Promise<void> {
    try {
      const { signature, timestamp } = await this.generateSignature('POST', '/analytics/track');

      await fetch(`${this.baseUrl}/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'x-signature': signature,
          'x-timestamp': timestamp,
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Erro ao rastrear acesso:', error);
    }
  }

  async getStats(): Promise<AnalyticsData | null> {
    try {
      const { signature, timestamp } = await this.generateSignature('GET', '/analytics/stats');

      const response = await fetch(`${this.baseUrl}/analytics/stats`, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'x-signature': signature,
          'x-timestamp': timestamp,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return null;
    }
  }
}

export const analyticsService = new AnalyticsService();