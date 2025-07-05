import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Moon, Sun, History, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onHistoryToggle: () => void;
  onSurpriseMe: () => void;
  isHistoryOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onHistoryToggle, 
  onSurpriseMe, 
  isHistoryOpen 
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header 
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Wand2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Prompts Barbudas
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                AI Enhancement Engine
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={onSurpriseMe}
              className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Surprise Me (Ctrl+Shift+R)"
            >
              <Sparkles className="h-4 w-4" />
            </motion.button>

            <motion.button
              onClick={onHistoryToggle}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isHistoryOpen
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Toggle History (Ctrl+Shift+H)"
            >
              <History className="h-4 w-4" />
            </motion.button>

            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Toggle Theme (Ctrl+Shift+T)"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};