import { SharedPrompt } from './SharedPrompt';

export interface SocialFeatures {
  friends: Friend[];
  friendRequests: FriendRequest[];
  messages: Message[];
  sharedPrompts: SharedPrompt[];
  collaborations: Collaboration[];
}

export interface Friend {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  isOnline: boolean;
  lastSeen: string;
  mutualFriends: number;
  friendshipDate: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  fromAvatar?: string;
  message?: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'prompt_share' | 'achievement_share' | 'system';
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  type: 'prompt' | 'image' | 'achievement';
  data: unknown;
}

export interface Collaboration {
  id: string;
  name: string;
  description: string;
  participants: string[];
  prompts: string[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'completed' | 'paused';
  permissions: CollaborationPermissions;
}

export interface CollaborationPermissions {
  canEdit: string[];
  canComment: string[];
  canInvite: string[];
  isPublic: boolean;
}