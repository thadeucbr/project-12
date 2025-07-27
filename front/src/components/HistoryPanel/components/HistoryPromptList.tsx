import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Copy, Trash2, RotateCcw } from 'lucide-react';
import type { Prompt } from '../../../types';

interface HistoryPromptListProps {
  filteredPrompts: Prompt[];
  promptsLength: number;
  getMediaType: (enhancementType: Prompt['enhancementType']) => 'text' | 'image' | 'video' | 'editing';
  mediaTypeIcons: Record<'text' | 'image' | 'video' | 'editing', React.ElementType>;
  formatDate: (timestamp: string) => string;
  onPromptSelect: (prompt: Prompt) => void;
  onPromptDelete: (id: string) => void;
  handleCopy: (text: string, id: string) => void;
  isCopied: string | null;
}

export const HistoryPromptList: React.FC<HistoryPromptListProps> = ({
  filteredPrompts,
  promptsLength,
  getMediaType,
  mediaTypeIcons,
  formatDate,
  onPromptSelect,
  onPromptDelete,
  handleCopy,
  isCopied,
}) => {
  return (
    <div className="p-6 space-y-4">
      {filteredPrompts.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {promptsLength === 0 ? 'Nenhum prompt ainda' : 'Nenhum prompt corresponde aos seus filtros'}
          </p>
        </div>
      ) : (
        filteredPrompts.map((prompt) => {
          const mediaType = getMediaType(prompt.enhancementType);
          const MediaIcon = mediaTypeIcons[mediaType];
          
          return (
            <motion.div
              key={prompt.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MediaIcon className="h-4 w-4 text-gray-500" />
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    prompt.enhancementType === 'detailed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                    prompt.enhancementType === 'creative' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                    prompt.enhancementType === 'technical' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                    prompt.enhancementType === 'concise' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                    prompt.enhancementType.startsWith('image-') ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300' :
                    prompt.enhancementType.startsWith('video-') ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' :
                    prompt.enhancementType.includes('-editing') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
                    'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300'
                  }`}>
                    {prompt.enhancementType}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(prompt.timestamp)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <motion.button
                    onClick={() => onPromptSelect(prompt)}
                    className="p-1 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900 rounded transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Usar este prompt"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleCopy(prompt.enhancedPrompt, prompt.id)}
                    className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Copiar prompt aprimorado"
                  >
                    {isCopied === prompt.id ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-green-500"
                      >
                        ✓
                      </motion.div>
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => onPromptDelete(prompt.id)}
                    className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Excluir prompt"
                  >
                    <Trash2 className="h-3 w-3" />
                  </motion.button>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                  Original:
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {prompt.originalPrompt}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                  Aprimorado:
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {prompt.enhancedPrompt}
                </p>
              </div>

              {prompt.tags.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  {prompt.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {prompt.tags.length > 4 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{prompt.tags.length - 4}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })
      )}
    </div>
  );
};
