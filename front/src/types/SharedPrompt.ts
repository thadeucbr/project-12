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