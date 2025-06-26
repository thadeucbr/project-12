import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  Copy, 
  Trash2, 
  Clock,
  RotateCcw,
  X
} from 'lucide-react';
import type { Prompt, HistoryFilters } from '../types';

interface HistoryPanelProps {
  prompts: Prompt[];
  onPromptSelect: (prompt: Prompt) => void;
  onPromptDelete: (id: string) => void;
  onClearHistory: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  prompts,
  onPromptSelect,
  onPromptDelete,
  onClearHistory,
  isOpen,
  onClose
}) => {
  // Bloqueia o scroll da página principal quando o painel está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const [filters, setFilters] = useState<HistoryFilters>({
    searchTerm: '',
    tags: [],
    dateRange: 'all',
    enhancementType: ''
  });
  const [isCopied, setIsCopied] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    prompts.forEach(prompt => {
      prompt.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [prompts]);

  const filteredPrompts = useMemo(() => {
    return prompts.filter(prompt => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (!prompt.originalPrompt.toLowerCase().includes(searchLower) &&
            !prompt.enhancedPrompt.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Tags filter
      if (filters.tags.length > 0) {
        if (!filters.tags.some(tag => prompt.tags.includes(tag))) {
          return false;
        }
      }

      // Enhancement type filter
      if (filters.enhancementType && prompt.enhancementType !== filters.enhancementType) {
        return false;
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const promptDate = new Date(prompt.timestamp);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - promptDate.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (filters.dateRange) {
          case 'today':
            if (daysDiff > 0) return false;
            break;
          case 'week':
            if (daysDiff > 7) return false;
            break;
          case 'month':
            if (daysDiff > 30) return false;
            break;
        }
      }

      return true;
    });
  }, [prompts, filters]);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(id);
      setTimeout(() => setIsCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Prompt History
                </h2>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={onClearHistory}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Clear all history"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Filters */}
              <div className="space-y-3">
                {/* Date Range */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  {['all', 'today', 'week', 'month'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setFilters(prev => ({ ...prev, dateRange: range as any }))}
                      className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                        filters.dateRange === range
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Tags */}
                {allTags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="h-4 w-4 text-gray-500" />
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-2 py-1 text-xs rounded-full transition-colors duration-200 ${
                          filters.tags.includes(tag)
                            ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* History List */}
            <div className="p-6 space-y-4">
              {filteredPrompts.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {prompts.length === 0 ? 'No prompts yet' : 'No prompts match your filters'}
                  </p>
                </div>
              ) : (
                filteredPrompts.map((prompt) => (
                  <motion.div
                    key={prompt.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          prompt.enhancementType === 'detailed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                          prompt.enhancementType === 'creative' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                          prompt.enhancementType === 'technical' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                          'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
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
                          title="Use this prompt"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleCopy(prompt.enhancedPrompt, prompt.id)}
                          className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Copy enhanced prompt"
                        >
                          <Copy className="h-3 w-3" />
                        </motion.button>
                        <motion.button
                          onClick={() => onPromptDelete(prompt.id)}
                          className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete prompt"
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
                        Enhanced:
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {prompt.enhancedPrompt}
                      </p>
                    </div>

                    {prompt.tags.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {prompt.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};