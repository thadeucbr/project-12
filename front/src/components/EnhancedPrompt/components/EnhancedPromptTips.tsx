import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { Prompt } from '../../../types';

interface EnhancedPromptTipsProps {
  enhancementType: Prompt['enhancementType'];
  isImageType: boolean;
  isVideoType: boolean;
  isEditingType: boolean;
  isAnimeType: boolean;
}

export const EnhancedPromptTips: React.FC<EnhancedPromptTipsProps> = ({
  enhancementType,
  isImageType,
  isVideoType,
  isEditingType,
  isAnimeType,
}) => {
  if (!(isImageType || isVideoType || isEditingType)) return null;

  return (
    <motion.div
      className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="flex items-start gap-3">
        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
          <strong>Dica:</strong> {
            isAnimeType
              ? 'Use este prompt em ferramentas como NovelAI, Waifu Diffusion, Anything V3, ou outros modelos especializados em anime para melhores resultados.'
            : isImageType
              ? 'Use este prompt em ferramentas como DALL-E, Midjourney, Stable Diffusion ou Leonardo AI para melhores resultados.'
            : isVideoType
              ? 'Use este prompt em ferramentas como RunwayML, Pika Labs, ou Stable Video Diffusion para criar vídeos incríveis.'
            : enhancementType === 'image-editing'
              ? 'Use estes comandos em ferramentas de IA como Photoshop AI, Canva AI, Remove.bg, ou Upscale.media.'
            : 'Execute estes comandos em ferramentas de IA como RunwayML, Kapwing AI, Descript, ou outros editores com IA.'
          }
        </div>
      </div>
    </motion.div>
  );
};
