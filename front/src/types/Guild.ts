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
  rewards: unknown[];
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