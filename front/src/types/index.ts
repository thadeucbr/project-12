export interface Prompt {
  id: string;
  originalPrompt: string;
  enhancedPrompt: string;
  timestamp: string;
  tags: string[];
  characterCount: number;
  enhancementType: 'detailed' | 'creative' | 'technical' | 'concise' | 
                   'image-realistic' | 'image-artistic' | 'image-anime' | 'image-commercial' |
                   'video-cinematic' | 'video-documentary' | 'video-animated' | 'video-commercial' |
                   'image-editing' | 'video-editing';
  mediaType?: 'text' | 'image' | 'video' | 'editing';
  isFavorite?: boolean;
  collectionId?: string;
  version?: number;
  parentId?: string; // Para versionamento
  isPublic?: boolean;
  shareId?: string;
  qualityScore?: number;
  effectivenessRating?: number;
  usageCount?: number;
  lastUsed?: string;
  generatedResults?: GeneratedResult[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  promptIds: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface GeneratedResult {
  id: string;
  promptId: string;
  platform: string; // 'dall-e', 'midjourney', 'chatgpt', etc.
  result: string | { url: string; description: string };
  timestamp: string;
  rating?: number;
  notes?: string;
}

export interface PromptVersion {
  id: string;
  promptId: string;
  version: number;
  content: string;
  changes: string;
  timestamp: string;
  isActive: boolean;
}

export interface SharedPrompt {
  id: string;
  promptId: string;
  shareId: string;
  isPublic: boolean;
  allowComments: boolean;
  allowForks: boolean;
  views: number;
  likes: number;
  forks: number;
  createdAt: string;
  expiresAt?: string;
}

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
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface HistoryFilters {
  searchTerm: string;
  tags: string[];
  dateRange: 'all' | 'today' | 'week' | 'month';
  enhancementType: string;
  mediaType?: string;
  collections: string[];
  favorites: boolean;
  qualityRange: [number, number];
  sortBy: 'date' | 'quality' | 'usage' | 'alphabetical';
  sortOrder: 'asc' | 'desc';
}

export interface Recommendation {
  id: string;
  type: 'similar' | 'improvement' | 'template' | 'trend';
  title: string;
  description: string;
  prompt?: string;
  confidence: number;
  reasons: string[];
}

export interface WorkflowStep {
  id: string;
  type: 'enhance' | 'generate' | 'export' | 'share';
  config: any;
  order: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  isActive: boolean;
  schedule?: string; // cron expression
  lastRun?: string;
}

export interface NotificationSettings {
  achievements: boolean;
  dailyReminders: boolean;
  weeklyReports: boolean;
  newFeatures: boolean;
  communityUpdates: boolean;
  sound: boolean;
  desktop: boolean;
}

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
  };
  editor: {
    fontSize: number;
    lineHeight: number;
    wordWrap: boolean;
    showLineNumbers: boolean;
    autoComplete: boolean;
  };
  shortcuts: Record<string, string>;
  layout: 'default' | 'compact' | 'expanded';
  language: string;
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
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  completed: boolean;
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS selector
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'type' | 'wait';
}

export interface CommunityPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  enhancementType: Prompt['enhancementType'];
  author: {
    id: string;
    name: string;
    avatar?: string;
    level: number;
  };
  stats: {
    views: number;
    likes: number;
    forks: number;
    comments: number;
  };
  tags: string[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  verified: boolean;
}

export interface Comment {
  id: string;
  promptId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
}

export interface BackupData {
  version: string;
  timestamp: string;
  prompts: Prompt[];
  collections: Collection[];
  settings: AppSettings;
  stats: UserStats;
}

export interface APIIntegration {
  id: string;
  name: string;
  type: 'image' | 'text' | 'video' | 'audio';
  endpoint: string;
  apiKey: string;
  isActive: boolean;
  config: Record<string, any>;
}

export interface GenerationRequest {
  promptId: string;
  platform: string;
  config: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  timestamp: string;
}