export interface AnalyticsData {
  overview: OverviewStats;
  trends: TrendData[];
  patterns: PatternInsight[];
  predictions: PredictionData[];
  comparisons: ComparisonData[];
}

export interface OverviewStats {
  totalPrompts: number;
  totalXP: number;
  averageQuality: number;
  mostProductiveHour: number;
  favoriteType: string;
  improvementRate: number;
}

export interface TrendData {
  period: string;
  metric: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PatternInsight {
  type: 'time' | 'quality' | 'type' | 'length';
  description: string;
  confidence: number;
  actionable: boolean;
  suggestion?: string;
}

export interface PredictionData {
  metric: string;
  currentValue: number;
  predictedValue: number;
  timeframe: string;
  confidence: number;
}

export interface ComparisonData {
  metric: string;
  userValue: number;
  averageValue: number;
  percentile: number;
  rank: number;
}