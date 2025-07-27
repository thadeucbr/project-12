import { Type, Image, Video, Edit } from 'lucide-react';
import type { Prompt } from '../../../types';

export const mediaTypeIcons = {
  text: Type,
  image: Image,
  video: Video,
  editing: Edit
};

export const getMediaType = (enhancementType: Prompt['enhancementType']): 'text' | 'image' | 'video' | 'editing' => {
  if (enhancementType.startsWith('image-')) return 'image';
  if (enhancementType.startsWith('video-')) return 'video';
  if (enhancementType.includes('-editing')) return 'editing';
  return 'text';
};
