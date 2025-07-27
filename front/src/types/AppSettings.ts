import { NotificationSettings } from './NotificationSettings';

export interface AppSettings {
  theme: Theme;
  autoSave: boolean;
  showCharacterCount: boolean;
  enableHapticFeedback: boolean;
  notifications: NotificationSettings;
  privacy: {
    shareUsageData: boolean;
    allowPublicPrompts: boolean;
    showInCommunity: boolean;
    showInLeaderboard: boolean;
    allowFriendRequests: boolean;
  };
  editor: {
    fontSize: number;
    lineHeight: number;
    wordWrap: boolean;
    showLineNumbers: boolean;
    autoComplete: boolean;
    spellCheck: boolean;
    darkMode: boolean;
  };
  shortcuts: Record<string, string>;
  layout: 'default' | 'compact' | 'expanded' | 'gaming';
  language: string;
  gamification: {
    showXP: boolean;
    showLevel: boolean;
    showStreak: boolean;
    showChallenges: boolean;
    showLeaderboard: boolean;
    enablePowerUps: boolean;
    celebrateAchievements: boolean;
    showEnergyBar: boolean;
    enableSounds: boolean;
    showParticleEffects: boolean;
    difficultyMode: 'casual' | 'normal' | 'hardcore';
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reduceMotion: boolean;
    screenReader: boolean;
  };
}

export type Theme = 'light' | 'dark' | 'auto' | 'custom';

export interface CustomTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
  };
  effects?: {
    particles: boolean;
    animations: boolean;
    gradients: boolean;
  };
}