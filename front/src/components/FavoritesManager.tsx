import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Folder, Plus, Search, Filter, Grid, List } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type { Prompt } from '../types';

interface FavoritesManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onPromptSelect: (prompt: Prompt) => void;
}

export const FavoritesManager: React.FC<FavoritesManagerProps> = ({
  isOpen,
  onClose,
  onPromptSelect
}) => {
  const { state, toggleFavorite } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'alphabetical' | 'type'>('date');

  const favoritePrompts = state.prompts.filter(prompt => 
    state.favorites.includes(prompt.id) &&
    (searchTerm === '' || 
     prompt.originalPrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
     prompt.enhancedPrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
     prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  ).sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.originalPrompt.localeCompare(b.originalPrompt);
      case 'type':
        return a.enhancementType.localeCompare(b.enhancementType);
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="fixed inset-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="h-8 w-8" />
                <div>
                  <h2 className="text-2xl font-bold">Prompts Favoritos</h2>
                  <p className="text-pink-100">{favoritePrompts.length} prompts salvos</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Controls */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar nos favoritos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="date">Data</option>
                <option value="alphabetical">Alfabética</option>
                <option value="type">Tipo</option>
              </select>

              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Favorites Grid/List */}
            {favoritePrompts.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Nenhum favorito encontrado
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  {searchTerm ? 'Tente uma busca diferente' : 'Marque prompts como favoritos para vê-los aqui'}
                </p>
              </div>
            ) : (
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
                  : 'space-y-3'
              } max-h-96 overflow-y-auto`}>
                {favoritePrompts.map((prompt) => (
                  <motion.div
                    key={prompt.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group ${
                      viewMode === 'list' ? 'flex items-center gap-4' : ''
                    }`}
                    onClick={() => onPromptSelect(prompt)}
                  >
                    <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          prompt.enhancementType === 'detailed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                          prompt.enhancementType === 'creative' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                          prompt.enhancementType === 'technical' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                          'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                        }`}>
                          {prompt.enhancementType}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(prompt.id);
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart className="h-4 w-4 text-pink-500 fill-current" />
                        </button>
                      </div>

                      <p className={`text-gray-700 dark:text-gray-300 font-medium mb-2 ${
                        viewMode === 'list' ? 'line-clamp-1' : 'line-clamp-2'
                      }`}>
                        {prompt.originalPrompt}
                      </p>

                      <p className={`text-sm text-gray-600 dark:text-gray-400 mb-3 ${
                        viewMode === 'list' ? 'line-clamp-1' : 'line-clamp-3'
                      }`}>
                        {prompt.enhancedPrompt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{new Date(prompt.timestamp).toLocaleDateString()}</span>
                        <span>{prompt.characterCount} chars</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};