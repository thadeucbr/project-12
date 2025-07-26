import { promptEnhancementService } from './apiService';

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
  private timeout: number;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    this.timeout = 30000; // 30 seconds
  }

  private async makeRequest(method: string, url: string, body?: any): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        credentials: 'include',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API Error: ${response.status} - ${response.statusText}. Details: ${errorBody}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async trackAccess(data: AnalyticsRequest): Promise<void> {
    try {
      await this.makeRequest(
        'POST',
        `${this.baseUrl}/analytics/track`,
        data
      );
    } catch (error) {
      console.error('Erro ao rastrear acesso:', error);
    }
  }

  async getStats(): Promise<AnalyticsData | null> {
    try {
      const response = await this.makeRequest(
        'GET',
        `${this.baseUrl}/analytics/stats`
      );
      return response as AnalyticsData;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return null;
    }
  }
}

export const analyticsService = new AnalyticsService();