export interface Prompt {
  id: string;
  originalPrompt: string;
  enhancedPrompt: string;
  timestamp: string;
  tags: string[];
  characterCount: number;
  enhancementType: 'detailed' | 'creative' | 'technical' | 'concise' | 
                   'image-realistic' | 'image-artistic' | 'image-conceptual' | 'image-commercial' |
                   'video-cinematic' | 'video-documentary' | 'video-animated' | 'video-commercial' |
                   'image-editing' | 'video-editing';
  mediaType?: 'text' | 'image' | 'video' | 'editing';
}

export interface HistoryFilters {
  searchTerm: string;
  tags: string[];
  dateRange: 'all' | 'today' | 'week' | 'month';
  enhancementType: string;
  mediaType?: string;
}

export type Theme = 'light' | 'dark';

export interface AppSettings {
  theme: Theme;
  autoSave: boolean;
  showCharacterCount: boolean;
  enableHapticFeedback: boolean;
}