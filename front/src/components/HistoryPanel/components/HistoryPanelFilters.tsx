import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Tag } from 'lucide-react';
import type { HistoryFilters } from '../../../types';
import { mediaTypeIcons } from '../utils/historyConstants';

export const HistoryPanelFilters: React.FC<HistoryPanelFiltersProps> = ({
  filters,
  setFilters,
  allTags,
  toggleTag,
}) => {
  return (
    <div className="p-6 pt-0">
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
            { id: 'text', label: 'Texto', icon: mediaTypeIcons.text },
            { id: 'image', label: 'Imagem', icon: mediaTypeIcons.image },
            { id: 'video', label: 'Vídeo', icon: mediaTypeIcons.video },
            { id: 'editing', label: 'Edição', icon: mediaTypeIcons.editing }
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
  );
};

