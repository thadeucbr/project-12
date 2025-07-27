import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, X } from 'lucide-react';

interface HistoryPanelHeaderProps {
  onClearHistory: () => void;
  onClose: () => void;
}

export const HistoryPanelHeader: React.FC<HistoryPanelHeaderProps> = ({
  onClearHistory,
  onClose,
}) => {
  return (
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
    </div>
  );
};
