export interface Recommendation {
  id: string;
  type: 'similar' | 'improvement' | 'template' | 'trend' | 'challenge' | 'powerup' | 'quest';
  title: string;
  description: string;
  prompt?: string;
  confidence: number;
  reasons: string[];
  xpReward?: number;
  coinReward?: number;
  action?: RecommendationAction;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  expiresAt?: string;
}

export interface RecommendationAction {
  type: 'create_prompt' | 'use_powerup' | 'join_challenge' | 'visit_shop' | 'complete_quest';
  data?: unknown;
}