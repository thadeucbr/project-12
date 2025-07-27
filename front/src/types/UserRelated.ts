import { Achievement, SkillPoints, Badge, Title } from './UserRelated';

export interface UserStats {
  totalPrompts: number;
  favoritePrompts: number;
  collectionsCount: number;
  dailyStreak: number;
  longestStreak: number;
  totalCharacters: number;
  averageQuality: number;
  mostUsedType: string;
  achievements: Achievement[];
  level: number;
  experience: number;
  nextLevelXP: number;
  rank: string;
  weeklyGoal: number;
  weeklyProgress: number;
  monthlyGoal: number;
  monthlyProgress: number;
  totalXP: number;
  skillPoints: SkillPoints;
  badges: Badge[];
  titles: Title[];
  activeTitle?: string;
  perfectDays: number; // Dias com 100% das metas atingidas
  comboMultiplier: number; // Multiplicador de XP por sequência
  lastActiveDate: string;
  coins: number; // Moeda do jogo
  gems: number; // Moeda premium
  energy: number; // Sistema de energia
  maxEnergy: number;
  energyRegenRate: number; // Energia por hora
  prestige: number; // Sistema de prestígio
  prestigePoints: number;
}

export interface SkillPoints {
  creativity: number;
  technical: number;
  efficiency: number;
  quality: number;
  consistency: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt: string;
  category: 'skill' | 'milestone' | 'special' | 'seasonal';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
}

export interface Title {
  id: string;
  name: string;
  description: string;
  requirements: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  color: string;
  effects?: TitleEffect[]; // Efeitos especiais do título
}

export interface TitleEffect {
  type: 'xp_boost' | 'coin_boost' | 'energy_boost' | 'special';
  value: number;
  description: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  category: 'creation' | 'quality' | 'consistency' | 'social' | 'exploration' | 'mastery';
  xpReward: number;
  coinReward?: number;
  gemReward?: number;
  progress?: number;
  maxProgress?: number;
  isSecret?: boolean;
  requirements?: AchievementRequirement[];
}

export interface AchievementRequirement {
  type: 'prompts_created' | 'streak_days' | 'quality_score' | 'collection_size' | 'special';
  value: number;
  description: string;
}