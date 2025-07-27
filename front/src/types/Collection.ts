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