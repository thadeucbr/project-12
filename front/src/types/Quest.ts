export interface WeeklyQuest {
  id: string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  xpReward: number;
  coinReward?: number;
  gemReward?: number;
  specialReward?: string; // Badge, título, etc.
  deadline: string;
  isCompleted: boolean;
  difficulty: 'normal' | 'hard' | 'extreme' | 'legendary';
  storyText?: string; // Narrativa da quest
  prerequisites?: string[]; // IDs de outras quests necessárias
}

export interface QuestObjective {
  id: string;
  description: string;
  type: string;
  target: number;
  progress: number;
  isCompleted: boolean;
  isOptional?: boolean;
  reward?: {
    xp?: number;
    coins?: number;
    gems?: number;
  };
}