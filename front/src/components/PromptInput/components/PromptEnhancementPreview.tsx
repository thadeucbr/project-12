import React from 'react';
import { motion } from 'framer-motion';
import { categoryLabels } from '../../../utils/promptConstants';
import type { Prompt } from '../../../types';

interface PromptEnhancementPreviewProps {
  selectedTypeInfo: { id: Prompt['enhancementType']; label: string; color: string; description: string; category: string; icon: React.ElementType } | undefined;
  selectedCategory: 'text' | 'image' | 'video' | 'editing';
}

export const PromptEnhancementPreview: React.FC<PromptEnhancementPreviewProps> = ({
  selectedTypeInfo,
  selectedCategory,
}) => {
  if (!selectedTypeInfo) return null;

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full border border-indigo-200 dark:border-indigo-700">
        <selectedTypeInfo.icon className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 dark:text-indigo-400" />
        <span className="text-xs sm:text-sm font-medium text-indigo-700 dark:text-indigo-300">
          {categoryLabels[selectedCategory]} • {selectedTypeInfo.label}
        </span>
      </div>
    </motion.div>
  );
};
