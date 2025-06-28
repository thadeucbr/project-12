export interface Prompt {
  id: string;
  originalPrompt: string;
  enhancedPrompt: string;
  timestamp: string;
  tags: string[];
  characterCount: number;
  enhancementType: 'detailed' | 'creative' | 'technical' | 'concise' | 'image' | 'video';
  mediaType?: 'text' | 'image' | 'video';
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