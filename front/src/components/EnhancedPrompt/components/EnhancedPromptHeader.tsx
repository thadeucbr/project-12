import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RotateCcw, Download, Share2 } from 'lucide-react';
import type { Prompt } from '../../../types';
import { typeIcons, typeDescriptions } from '../../../utils/promptConstants';

interface EnhancedPromptHeaderProps {
  enhancementType: Prompt['enhancementType'];
  isTyping: boolean;
  isCopied: boolean;
  isShared: boolean;
  showFullText: boolean;
  handleCopy: () => void;
  handleDownload: () => void;
  handleShare: () => void;
  toggleFullText: () => void;
  getTextColor: () => string;
  getSubtextColor: () => string;
  typeColor: string;
  isEditingType: boolean;
  isAnimeType: boolean;
  isImageType: boolean;
  isVideoType: boolean;
}

export const EnhancedPromptHeader: React.FC<EnhancedPromptHeaderProps> = ({
  enhancementType,
  isTyping,
  isCopied,
  isShared,
  showFullText,
  handleCopy,
  handleDownload,
  handleShare,
  toggleFullText,
  getTextColor,
  getSubtextColor,
  typeColor,
  isEditingType,
  isAnimeType,
  isImageType,
  isVideoType,
}) => {
  const TypeIcon = typeIcons[enhancementType];

  return (
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <motion.div
          animate={{ rotate: isTyping ? 360 : 0 }}
          transition={{ duration: 2, repeat: isTyping ? Infinity : 0, ease: "linear" }}
          className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${typeColor} shadow-lg flex-shrink-0`}
        >
          <TypeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </motion.div>
        <div className="min-w-0 flex-1">
          <h3 className={`text-lg sm:text-xl font-bold ${getTextColor()} truncate`}>
            {isEditingType ? 'Comandos de IA' : 'Prompt'} Aprimorado
          </h3>
          <p className={`text-xs sm:text-sm ${getSubtextColor()} line-clamp-2`}>
            {typeDescriptions[enhancementType]}
          </p>
        </div>
        {isTyping && (
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="ml-2 flex-shrink-0"
          >
            <div className={`h-2 w-2 ${
              isEditingType ? 'bg-emerald-500' : 
              isAnimeType ? 'bg-pink-500' :
              isImageType ? 'bg-blue-500' :
              isVideoType ? 'bg-slate-500' : 'bg-purple-500'
            } rounded-full`} />
          </motion.div>
        )}
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2 ml-2">
        <motion.button
          onClick={toggleFullText}
          className={`p-1.5 sm:p-2 ${getSubtextColor()} ${
            isEditingType ? 'hover:bg-emerald-100 dark:hover:bg-emerald-800' :
            isAnimeType ? 'hover:bg-pink-100 dark:hover:bg-pink-800' :
            isImageType ? 'hover:bg-blue-100 dark:hover:bg-blue-800' :
            isVideoType ? 'hover:bg-slate-100 dark:hover:bg-slate-800' : 
            'hover:bg-purple-100 dark:hover:bg-purple-800'
          } rounded-lg transition-colors duration-200`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={showFullText ? "Mostrar efeito de digitação" : "Mostrar texto completo"}
        >
          <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
        </motion.button>
        
        <motion.button
          onClick={handleDownload}
          className={`p-1.5 sm:p-2 ${getSubtextColor()} ${
            isEditingType ? 'hover:bg-emerald-100 dark:hover:bg-emerald-800' :
            isAnimeType ? 'hover:bg-pink-100 dark:hover:bg-pink-800' :
            isImageType ? 'hover:bg-blue-100 dark:hover:bg-blue-800' :
            isVideoType ? 'hover:bg-slate-100 dark:hover:bg-slate-800' : 
            'hover:bg-purple-100 dark:hover:bg-purple-800'
          } rounded-lg transition-colors duration-200 hidden sm:block`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Baixar como arquivo"
        >
          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
        </motion.button>

        <motion.button
          onClick={handleShare}
          className={`p-1.5 sm:p-2 ${getSubtextColor()} ${
            isEditingType ? 'hover:bg-emerald-100 dark:hover:bg-emerald-800' :
            isAnimeType ? 'hover:bg-pink-100 dark:hover:bg-pink-800' :
            isImageType ? 'hover:bg-blue-100 dark:hover:bg-blue-800' :
            isVideoType ? 'hover:bg-slate-100 dark:hover:bg-slate-800' : 
            'hover:bg-purple-100 dark:hover:bg-purple-800'
          } rounded-lg transition-colors duration-200 hidden sm:block`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Compartilhar"
        >
          {isShared ? (
            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : (
            <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
        </motion.button>
        
        <motion.button
          onClick={handleCopy}
          className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r ${typeColor} text-white rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl text-sm`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCopied ? (
            <>
              <Check className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium">Copiar</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};
