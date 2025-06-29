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
  xpEarned?: number; // XP ganho com este prompt
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  completionTime?: number; // Tempo para criar o prompt (em segundos)
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
  xpBonus?: number; // XP bonus por completar a coleção
  isCompleted?: boolean;
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

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'xp_boost' | 'quality_boost' | 'speed_boost' | 'streak_protection' | 'double_rewards' | 'energy_boost' | 'coin_boost';
  duration: number; // em minutos
  multiplier: number;
  cost: number; // em moedas ou gemas
  currency: 'coins' | 'gems';
  isActive: boolean;
  activatedAt?: string;
  expiresAt?: string;
  cooldown?: number; // tempo de recarga em horas
  maxUses?: number; // usos máximos por dia
  usesToday?: number;
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
  sortBy: 'date' | 'quality' | 'usage' | 'alphabetical' | 'xp';
  sortOrder: 'asc' | 'desc';
}

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
  data?: any;
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
  automationLevel: 'manual' | 'semi' | 'full';
  triggers: WorkflowTrigger[];
}

export interface WorkflowTrigger {
  type: 'time' | 'event' | 'condition';
  config: any;
}

export interface NotificationSettings {
  achievements: boolean;
  dailyReminders: boolean;
  weeklyReports: boolean;
  newFeatures: boolean;
  communityUpdates: boolean;
  challenges: boolean;
  streakReminders: boolean;
  levelUp: boolean;
  questUpdates: boolean;
  leaderboardChanges: boolean;
  energyFull: boolean;
  powerupExpiring: boolean;
  sound: boolean;
  desktop: boolean;
  email: boolean;
  push: boolean;
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

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  completed: boolean;
  xpReward: number;
  coinReward?: number;
  prerequisites?: string[];
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS selector
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'type' | 'wait';
  validation?: () => boolean;
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
    title?: string;
    badges: string[];
  };
  stats: {
    views: number;
    likes: number;
    forks: number;
    comments: number;
    rating: number;
    downloads: number;
  };
  tags: string[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  verified: boolean;
  xpReward: number;
  coinReward?: number;
  license: 'free' | 'premium' | 'exclusive';
  price?: number;
}

export interface Comment {
  id: string;
  promptId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    level: number;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
  isEdited: boolean;
  isPinned: boolean;
}

export interface BackupData {
  version: string;
  timestamp: string;
  prompts: Prompt[];
  collections: Collection[];
  settings: AppSettings;
  stats: UserStats;
  achievements: Achievement[];
  customThemes?: CustomTheme[];
}

export interface APIIntegration {
  id: string;
  name: string;
  type: 'image' | 'text' | 'video' | 'audio';
  endpoint: string;
  apiKey: string;
  isActive: boolean;
  config: Record<string, any>;
  rateLimits?: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  costs?: {
    perRequest: number;
    currency: string;
  };
}

export interface GenerationRequest {
  promptId: string;
  platform: string;
  config: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  timestamp: string;
  estimatedTime?: number;
  cost?: number;
}

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

export interface Shop {
  categories: ShopCategory[];
  featuredItems: ShopItem[];
  dailyDeals: ShopItem[];
  limitedOffers: ShopItem[];
}

export interface ShopCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: ShopItem[];
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'powerup' | 'theme' | 'avatar' | 'title' | 'badge' | 'energy' | 'coins' | 'gems' | 'bundle';
  price: number;
  currency: 'coins' | 'gems' | 'real_money';
  originalPrice?: number; // Para mostrar desconto
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  isLimited: boolean;
  limitedQuantity?: number;
  soldQuantity?: number;
  expiresAt?: string;
  requirements?: ShopRequirement[];
  preview?: string; // URL para preview
  bundle?: ShopItem[]; // Para bundles
  discount?: number; // Porcentagem de desconto
}

export interface ShopRequirement {
  type: 'level' | 'achievement' | 'title' | 'streak' | 'special';
  value: string | number;
  description: string;
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  icon: string;
  banner?: string;
  level: number;
  experience: number;
  memberCount: number;
  maxMembers: number;
  isPublic: boolean;
  requirements?: GuildRequirement[];
  perks: GuildPerk[];
  activities: GuildActivity[];
  leaderboard: GuildMemberRank[];
  createdAt: string;
  ownerId: string;
}

export interface GuildRequirement {
  type: 'level' | 'achievement' | 'invitation';
  value: number | string;
}

export interface GuildPerk {
  id: string;
  name: string;
  description: string;
  type: 'xp_boost' | 'coin_boost' | 'energy_boost' | 'special';
  value: number;
  isActive: boolean;
}

export interface GuildActivity {
  id: string;
  type: 'challenge' | 'event' | 'competition';
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  rewards: any[];
  participants: string[];
  isActive: boolean;
}

export interface GuildMemberRank {
  userId: string;
  username: string;
  role: 'owner' | 'admin' | 'member';
  contribution: number;
  joinedAt: string;
  lastActive: string;
}

export interface SocialFeatures {
  friends: Friend[];
  friendRequests: FriendRequest[];
  messages: Message[];
  sharedPrompts: SharedPrompt[];
  collaborations: Collaboration[];
}

export interface Friend {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  isOnline: boolean;
  lastSeen: string;
  mutualFriends: number;
  friendshipDate: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  fromAvatar?: string;
  message?: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'prompt_share' | 'achievement_share' | 'system';
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  type: 'prompt' | 'image' | 'achievement';
  data: any;
}

export interface Collaboration {
  id: string;
  name: string;
  description: string;
  participants: string[];
  prompts: string[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'completed' | 'paused';
  permissions: CollaborationPermissions;
}

export interface CollaborationPermissions {
  canEdit: string[];
  canComment: string[];
  canInvite: string[];
  isPublic: boolean;
}

// Tipos para Analytics e Insights
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