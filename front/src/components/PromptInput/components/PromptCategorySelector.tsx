import React from 'react';
import { motion } from 'framer-motion';
import { categoryLabels, categoryIcons } from '../../../utils/promptConstants';

interface PromptCategorySelectorProps {
  selectedCategory: 'text' | 'image' | 'video' | 'editing';
  onSelectCategory: (category: 'text' | 'image' | 'video' | 'editing') => void;
}

export const PromptCategorySelector: React.FC<PromptCategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <motion.div 
      className="space-y-3 sm:space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="text-center">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Escolha o tipo de conteúdo
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 px-2">
          Selecione a categoria que melhor descreve o que você quer criar
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {Object.entries(categoryLabels).map(([key, label]) => {
          const Icon = categoryIcons[key as keyof typeof categoryIcons];
          const isSelected = selectedCategory === key;
          return (
            <motion.button
              key={key}
              type="button"
              onClick={() => onSelectCategory(key as 'text' | 'image' | 'video' | 'editing')}
              className={`flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border-2 ${
                isSelected
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-500 shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md'
              }`}
              whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
              <span className="text-center leading-tight">{label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
