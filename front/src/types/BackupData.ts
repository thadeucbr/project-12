import { Prompt } from './Prompt';
import { Collection } from './Collection';
import { AppSettings } from './AppSettings';
import { UserStats, Achievement } from './UserRelated';
import { CustomTheme } from './AppSettings';

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