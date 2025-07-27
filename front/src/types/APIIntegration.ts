export interface APIIntegration {
  id: string;
  name: string;
  type: 'image' | 'text' | 'video' | 'audio';
  endpoint: string;
  apiKey: string;
  isActive: boolean;
  config: Record<string, unknown>;
  rateLimits?: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  costs?: {
    perRequest: number;
    currency: string;
  };
}