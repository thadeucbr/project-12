export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'create_prompts' | 'use_type' | 'reach_quality' | 'streak' | 'collection' | 'share' | 'perfect_day' | 'speed_challenge';
  target: number;
  progress: number;
  xpReward: number;
  coinReward?: number;
  gemReward?: number;
  deadline: string;
  isCompleted: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  energyCost?: number;
  bonusMultiplier?: number;
}