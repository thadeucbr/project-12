import { AnalyticsRequestDto } from '../dtos/analytics.dto';

interface AnalyticsData {
  totalAccesses: number;
  todayAccesses: Set<string>;
  totalPrompts: number;
  enhancementTypes: Record<string, number>;
}

class AnalyticsService {
  private data: AnalyticsData = {
    totalAccesses: 0,
    todayAccesses: new Set(),
    totalPrompts: 0,
    enhancementTypes: {},
  };

  private lastReset: Date = new Date();

  constructor() {
    this.resetDailyStats();
  }

  private resetDailyStats() {
    const now = new Date();
    if (now.getDate() !== this.lastReset.getDate()) {
      this.data.todayAccesses.clear();
      this.lastReset = now;
    }
  }

  async track(dto: AnalyticsRequestDto) {
    this.resetDailyStats();

    if (!this.data.todayAccesses.has(dto.ip)) {
      this.data.todayAccesses.add(dto.ip);
      this.data.totalAccesses++;
    }

    if (dto.prompt) {
      this.data.totalPrompts++;
    }

    if (dto.enhancementType) {
      this.data.enhancementTypes[dto.enhancementType] = (this.data.enhancementTypes[dto.enhancementType] || 0) + 1;
    }
  }

  async getStats() {
    this.resetDailyStats();
    return {
      totalAccesses: this.data.totalAccesses,
      todayAccesses: this.data.todayAccesses.size,
      totalPrompts: this.data.totalPrompts,
      enhancementTypes: this.data.enhancementTypes,
    };
  }
}

export const analyticsService = new AnalyticsService();
