export interface PromptVersion {
  id: string;
  promptId: string;
  version: number;
  content: string;
  changes: string;
  timestamp: string;
  isActive: boolean;
}