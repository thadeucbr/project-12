import React from 'react';
import { motion } from 'framer-motion';
import { enhancementTypes, categoryIcons } from '../../../utils/promptConstants';
import type { Prompt } from '../../../types';

interface PromptEnhancementTypeSelectorProps {
  selectedCategory: 'text' | 'image' | 'video' | 'editing';
  selectedType: Prompt['enhancementType'];
  onSelectType: (type: Prompt['enhancementType']) => void;
}

export const PromptEnhancementTypeSelector: React.FC<PromptEnhancementTypeSelectorProps> = ({
  selectedCategory,
  selectedType,
  onSelectType,
}) => {
  const filteredTypes = enhancementTypes.filter(type => type.category === selectedCategory);
  const CategoryIcon = categoryIcons[selectedCategory];

  return (
    <motion.div 
      className="space-y-3 sm:space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="text-center">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center justify-center gap-2">
          <CategoryIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          Estilo de aprimoramento
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 px-2">
          {selectedCategory === 'image' && 'Escolha o estilo visual que melhor se adequa ao seu projeto'}
          {selectedCategory === 'video' && 'Selecione o formato de vídeo que você deseja criar'}
          {selectedCategory === 'text' && 'Como você gostaria que seu prompt fosse otimizado?'}
          {selectedCategory === 'editing' && 'Tipo de edição com IA que você quer realizar'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {filteredTypes.map((type) => {
          const isSelected = selectedType === type.id;
          return (
            <motion.button
              key={type.id}
              type="button"
              onClick={() => onSelectType(type.id)}
              className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border-2 text-left ${
                isSelected
                  ? `bg-gradient-to-r ${type.color} text-white border-transparent shadow-lg`
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`p-1.5 sm:p-2 rounded-lg ${isSelected ? 'bg-white/20' : `bg-gradient-to-r ${type.color}`}`}>
                <type.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${isSelected ? 'text-white' : 'text-white'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{type.label}</div>
                <div className={`text-xs mt-1 line-clamp-2 ${isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                  {type.description.split(' ').slice(0, 6).join(' ')}...
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
