import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedPromptQualityIndicatorsProps {
  getSubtextColor: () => string;
  isEditingType: boolean;
  isAnimeType: boolean;
  isImageType: boolean;
  isVideoType: boolean;
}

export const EnhancedPromptQualityIndicators: React.FC<EnhancedPromptQualityIndicatorsProps> = ({
  getSubtextColor,
  isEditingType,
  isAnimeType,
  isImageType,
  isVideoType,
}) => {
  return (
    <motion.div
      className={`mt-4 sm:mt-6 flex items-center justify-center gap-4 sm:gap-6 text-xs ${getSubtextColor()} flex-wrap`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>Estruturado</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span>Contextualizado</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 ${
          isEditingType ? 'bg-emerald-500' :
          isAnimeType ? 'bg-pink-500' :
          isImageType ? 'bg-blue-500' :
          isVideoType ? 'bg-slate-500' : 'bg-purple-500'
        } rounded-full`}></div>
        <span className="text-center">
          {isEditingType ? 'Otimizado para IA de Edição' : 
           isAnimeType ? 'Otimizado para Anime/Manga' :
           isImageType ? 'Otimizado para Geração de Imagem' :
           isVideoType ? 'Otimizado para Geração de Vídeo' : 'Otimizado para LLM'}
        </span>
      </div>
    </motion.div>
  );
};
