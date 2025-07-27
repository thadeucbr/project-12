import { DailyChallenge } from './DailyChallenge';
import { Badge, Title, Achievement } from './UserRelated';
import { Leaderboard } from './Leaderboard';

export interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  theme: string;
  specialChallenges: DailyChallenge[];
  exclusiveRewards: (Badge | Title | Achievement)[];
  isActive: boolean;
  bonusMultipliers: {
    xp: number;
    coins: number;
    gems?: number;
  };
  leaderboard?: Leaderboard;
  storyContent?: EventStoryContent[];
}

export interface EventStoryContent {
  id: string;
  title: string;
  content: string;
  unlockCondition: string;
  isUnlocked: boolean;
  rewards?: {
    xp?: number;
    coins?: number;
    gems?: number;
    items?: string[];
  };
}