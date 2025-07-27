import { Prompt } from './Prompt';

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