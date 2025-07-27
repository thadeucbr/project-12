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