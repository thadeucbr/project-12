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

export interface GeneratedResult {
  id: string;
  promptId: string;
  platform: string; // 'dall-e', 'midjourney', 'chatgpt', etc.
  result: string | { url: string; description: string };
  timestamp: string;
  rating?: number;
  notes?: string;
}