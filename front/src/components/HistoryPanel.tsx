import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryPanelHeader } from './HistoryPanel/components/HistoryPanelHeader';
import { HistoryPanelFilters } from './HistoryPanel/components/HistoryPanelFilters';
import { HistoryPromptList } from './HistoryPanel/components/HistoryPromptList';

import type { Prompt, HistoryFilters } from '../types';

interface HistoryPanelProps {
  prompts: Prompt[];
  onPromptSelect: (prompt: Prompt) => void;
  onPromptDelete: (id: string) => void;
  onClearHistory: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const mediaTypeIcons = {
  text: Type,
  image: Image,
  video: Video,
  editing: Edit
};

const getMediaType = (enhancementType: Prompt['enhancementType']): 'text' | 'image' | 'video' | 'editing' => {
  if (enhancementType.startsWith('image-')) return 'image';
  if (enhancementType.startsWith('video-')) return 'video';
  if (enhancementType.includes('-editing')) return 'editing';
  return 'text';
};

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
    enhancementType: '',
    mediaType: '',
    collections: [],
    favorites: false,
    qualityRange: [0, 10],
    sortBy: 'date',
    sortOrder: 'desc'
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
      // Filtro de busca
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (!prompt.originalPrompt.toLowerCase().includes(searchLower) &&
            !prompt.enhancedPrompt.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Filtro de tags
      if (filters.tags.length > 0) {
        if (!filters.tags.some(tag => prompt.tags.includes(tag))) {
          return false;
        }
      }

      // Filtro de tipo de aprimoramento
      if (filters.enhancementType && prompt.enhancementType !== filters.enhancementType) {
        return false;
      }

      // Filtro de tipo de mídia
      if (filters.mediaType) {
        const promptMediaType = getMediaType(prompt.enhancementType);
        if (promptMediaType !== filters.mediaType) {
          return false;
        }
      }

      // Filtro de período
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
      console.error('Falha ao copiar texto:', error);
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
      return 'Agora mesmo';
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else if (diffInHours < 48) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR');
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
            <HistoryPanelHeader
              onClearHistory={onClearHistory}
              onClose={onClose}
            />

              <HistoryPanelFilters
              filters={filters}
              setFilters={setFilters}
              allTags={allTags}
              toggleTag={toggleTag}
            />
            </div>

            <HistoryPromptList
              filteredPrompts={filteredPrompts}
              promptsLength={prompts.length}
              getMediaType={getMediaType}
              mediaTypeIcons={mediaTypeIcons}
              formatDate={formatDate}
              onPromptSelect={onPromptSelect}
              onPromptDelete={onPromptDelete}
              handleCopy={handleCopy}
              isCopied={isCopied}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};