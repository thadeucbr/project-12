import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Heart, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 py-4 sm:py-6 mt-8 sm:mt-12"
    >
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2 text-center">
            <span>Desenvolvido com</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 fill-current" />
            </motion.div>
            <span>por</span>
            <motion.a
              href="https://www.linkedin.com/in/thadeucbr/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Thadeu Castelo Branco Ramos
              <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </motion.a>
          </div>
          
          <div className="flex items-center gap-2 text-center">
            <span>com muita ajuda de</span>
            <motion.a
              href="https://bolt.new"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
              bolt.new
              <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </motion.a>
          </div>
        </div>
        
        <div className="text-center mt-3 sm:mt-4">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © 2024 PromptCraft. Transformando ideias em prompts poderosos.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};