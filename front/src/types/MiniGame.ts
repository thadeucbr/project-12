export interface MiniGame {
  id: string;
  name: string;
  description: string;
  type: 'word_puzzle' | 'prompt_builder' | 'speed_typing' | 'creativity_test' | 'memory_game' | 'pattern_match';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  xpReward: number;
  coinReward?: number;
  playCount: number;
  bestScore: number;
  isUnlocked: boolean;
  energyCost: number;
  timeLimit?: number; // em segundos
  dailyLimit?: number;
  playsToday?: number;
  leaderboard?: MiniGameLeaderboard[];
}

export interface MiniGameLeaderboard {
  userId: string;
  username: string;
  score: number;
  timestamp: string;
  rank: number;
}