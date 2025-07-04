import { AnalyticsRequestDto } from '../dtos/analytics.dto';
import { Analytics } from '../models/analytics.model';

class AnalyticsService {
  async track(dto: AnalyticsRequestDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Analytics.create({ date: today, ip: dto.ip, prompt: dto.prompt, enhancementType: dto.enhancementType });
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalAccesses = await Analytics.countDocuments();
    const todayAccesses = await Analytics.countDocuments({ date: today });
    const totalPrompts = await Analytics.countDocuments({ prompt: { $exists: true } });
    const enhancementTypes = await Analytics.aggregate([
      { $match: { enhancementType: { $exists: true } } },
      { $group: { _id: '$enhancementType', count: { $sum: 1 } } },
    ]);

    return {
      totalAccesses,
      todayAccesses,
      totalPrompts,
      enhancementTypes: enhancementTypes.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };
  }
}

export const analyticsService = new AnalyticsService();