export interface GenerationRequest {
  promptId: string;
  platform: string;
  config: Record<string, unknown>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: unknown;
  error?: string;
  timestamp: string;
  estimatedTime?: number;
  cost?: number;
}