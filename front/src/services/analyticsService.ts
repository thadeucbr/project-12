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

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  }

  async trackAccess(data: AnalyticsRequest): Promise<void> {
    try {
      await promptEnhancementService.makeRequest(
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
      const response = await promptEnhancementService.makeRequest(
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