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
  X,
  Type,
  Image,
  Video,
  Edit
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
            {/* Header */}
            <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Histórico de Prompts
                </h2>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={onClearHistory}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Limpar todo o histórico"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Fechar painel"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              {/* Busca */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar prompts..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Filtros */}
              <div className="space-y-3">
                {/* Período */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'today', label: 'Hoje' },
                    { id: 'week', label: 'Semana' },
                    { id: 'month', label: 'Mês' }
                  ].map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setFilters(prev => ({ ...prev, dateRange: range.id }))}
                      className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                        filters.dateRange === range.id
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>

                {/* Filtro de Tipo de Mídia */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="h-4 w-4 text-gray-500" />
                  {[
                    { id: 'all', label: 'Todos', icon: Filter },
                    { id: 'text', label: 'Texto', icon: Type },
                    { id: 'image', label: 'Imagem', icon: Image },
                    { id: 'video', label: 'Vídeo', icon: Video },
                    { id: 'editing', label: 'Edição', icon: Edit }
                  ].map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setFilters(prev => ({ ...prev, mediaType: type.id === 'all' ? '' : type.id }))}
                        className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                          (type.id === 'all' && !filters.mediaType) || filters.mediaType === type.id
                            ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="h-3 w-3" />
                        {type.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tags */}
                {allTags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="h-4 w-4 text-gray-500" />
                    {allTags.slice(0, 8).map((tag) => (
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
                    {allTags.length > 8 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{allTags.length - 8} mais
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Lista do Histórico */}
            <div className="p-6 space-y-4">
              {filteredPrompts.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {prompts.length === 0 ? 'Nenhum prompt ainda' : 'Nenhum prompt corresponde aos seus filtros'}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};