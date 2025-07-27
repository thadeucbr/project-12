export interface Leaderboard {
  id: string;
  type: 'weekly' | 'monthly' | 'all_time' | 'seasonal';
  category: 'xp' | 'prompts' | 'quality' | 'streak' | 'coins' | 'achievements';
  entries: LeaderboardEntry[];
  lastUpdated: string;
  season?: string;
  rewards?: LeaderboardReward[];
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  rank: number;
  level: number;
  title?: string;
  badge?: string;
  change?: number; // Mudança de posição
  isCurrentUser?: boolean;
}

export interface LeaderboardReward {
  rank: number;
  xp: number;
  coins: number;
  gems?: number;
  specialReward?: string;
}