import React from 'react';
import { motion } from 'framer-motion';
import type { Prompt } from '../../../types';
import { typeLabels } from '../../../utils/promptConstants';

interface EnhancedPromptTextDisplayProps {
  prompt: string;
  displayedText: string;
  isTyping: boolean;
  showFullText: boolean;
  isEditingType: boolean;
  isAnimeType: boolean;
  isImageType: boolean;
  isVideoType: boolean;
  getSubtextColor: () => string;
  typeColor: string;
  enhancementType: Prompt['enhancementType'];
}

export const EnhancedPromptTextDisplay: React.FC<EnhancedPromptTextDisplayProps> = ({
  prompt,
  displayedText,
  isTyping,
  showFullText,
  isEditingType,
  isAnimeType,
  isImageType,
  isVideoType,
  getSubtextColor,
  typeColor,
  enhancementType,
}) => {
  return (
    <div className="relative">
      <motion.div
        className={`text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap font-mono text-sm sm:text-sm p-4 sm:p-6 bg-white/60 dark:bg-gray-900/40 rounded-xl border ${
          isEditingType ? 'border-emerald-100 dark:border-emerald-800' :
          isAnimeType ? 'border-pink-100 dark:border-pink-800' :
          isImageType ? 'border-blue-100 dark:border-blue-800' :
          isVideoType ? 'border-slate-100 dark:border-slate-800' : 
          'border-purple-100 dark:border-purple-800'
        } backdrop-blur-sm`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {showFullText ? prompt : displayedText}
        {isTyping && !showFullText && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className={`inline-block w-2 h-5 ${
              isEditingType ? 'bg-emerald-500' :
              isAnimeType ? 'bg-pink-500' :
              isImageType ? 'bg-blue-500' :
              isVideoType ? 'bg-slate-500' : 'bg-purple-500'
            } ml-1`}
          />
        )}
      </motion.div>
      
      {/* Character count and stats */}
      <div className={`flex items-center justify-between mt-3 sm:mt-4 text-xs ${getSubtextColor()}`}>
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <span>
            {prompt.length} caracteres • {prompt.split(' ').length} palavras
          </span>
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${typeColor} text-white`}>
            {typeLabels[enhancementType]}
          </span>
        </div>
        <span className="hidden sm:inline">
          ~{Math.ceil(prompt.length / 4)} tokens
        </span>
      </div>
    </div>
  );
};
