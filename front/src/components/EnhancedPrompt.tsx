import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Sparkles, RotateCcw, Type, Code, Lightbulb, Target, Image, Video, Wand2, Scissors } from 'lucide-react';
import type { Prompt } from '../types';

interface EnhancedPromptProps {
  prompt: string;
  isVisible: boolean;
  onCopy?: () => void;
  enhancementType?: Prompt['enhancementType'];
}

const typeIcons = {
  detailed: Type,
  creative: Lightbulb,
  technical: Code,
  concise: Target,
  image: Image,
  video: Video,
  'image-editing': Wand2,
  'video-editing': Scissors
};

const typeColors = {
  detailed: 'from-blue-500 to-cyan-500',
  creative: 'from-purple-500 to-pink-500',
  technical: 'from-green-500 to-emerald-500',
  concise: 'from-orange-500 to-red-500',
  image: 'from-pink-500 to-rose-500',
  video: 'from-indigo-500 to-purple-600',
  'image-editing': 'from-emerald-500 to-teal-500',
  'video-editing': 'from-violet-500 to-indigo-600'
};

const typeLabels = {
  detailed: 'Detalhado',
  creative: 'Criativo',
  technical: 'Técnico',
  concise: 'Conciso',
  image: 'Geração de Imagem',
  video: 'Geração de Vídeo',
  'image-editing': 'Edição de Imagem com IA',
  'video-editing': 'Edição de Vídeo com IA'
};

const typeDescriptions = {
  detailed: 'Prompt detalhado e abrangente',
  creative: 'Prompt criativo e inovador',
  technical: 'Prompt técnico e preciso',
  concise: 'Prompt direto e objetivo',
  image: 'Otimizado para geração de imagens',
  video: 'Especializado para criação de vídeos',
  'image-editing': 'Comandos para IA de edição de imagens',
  'video-editing': 'Comandos para IA de edição de vídeos'
};

export const EnhancedPrompt: React.FC<EnhancedPromptProps> = ({ 
  prompt, 
  isVisible, 
  onCopy,
  enhancementType = 'detailed'
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  useEffect(() => {
    if (isVisible && prompt) {
      setIsTyping(true);
      setDisplayedText('');
      setShowFullText(false);
      
      let index = 0;
      const typingSpeed = 20; // milliseconds per character
      
      const typewriter = setInterval(() => {
        if (index < prompt.length) {
          setDisplayedText(prompt.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(typewriter);
        }
      }, typingSpeed);

      return () => clearInterval(typewriter);
    }
  }, [prompt, isVisible]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setIsCopied(true);
      onCopy?.();
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Falha ao copiar texto:', error);
    }
  };

  const toggleFullText = () => {
    setShowFullText(!showFullText);
    if (!showFullText) {
      setDisplayedText(prompt);
      setIsTyping(false);
    } else {
      // Restart typewriter effect
      setDisplayedText('');
      setIsTyping(true);
      let index = 0;
      const typewriter = setInterval(() => {
        if (index < prompt.length) {
          setDisplayedText(prompt.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(typewriter);
        }
      }, 10); // Faster speed for replay
    }
  };

  if (!isVisible || !prompt) return null;

  const TypeIcon = typeIcons[enhancementType];
  const typeColor = typeColors[enhancementType];
  const typeLabel = typeLabels[enhancementType];
  const typeDescription = typeDescriptions[enhancementType];

  const isMediaType = enhancementType === 'image' || enhancementType === 'video';
  const isEditingType = enhancementType === 'image-editing' || enhancementType === 'video-editing';

  const getBackgroundGradient = () => {
    if (isEditingType) {
      return 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20';
    }
    if (isMediaType) {
      return 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20';
    }
    return 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20';
  };

  const getBorderColor = () => {
    if (isEditingType) {
      return 'border-emerald-200 dark:border-emerald-700';
    }
    if (isMediaType) {
      return 'border-indigo-200 dark:border-indigo-700';
    }
    return 'border-purple-200 dark:border-purple-700';
  };

  const getTextColor = () => {
    if (isEditingType) {
      return 'text-emerald-800 dark:text-emerald-200';
    }
    if (isMediaType) {
      return 'text-indigo-800 dark:text-indigo-200';
    }
    return 'text-purple-800 dark:text-purple-200';
  };

  const getSubtextColor = () => {
    if (isEditingType) {
      return 'text-emerald-600 dark:text-emerald-400';
    }
    if (isMediaType) {
      return 'text-indigo-600 dark:text-indigo-400';
    }
    return 'text-purple-600 dark:text-purple-400';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto mt-8"
      >
        <motion.div
          className={`bg-gradient-to-br ${getBackgroundGradient()} rounded-2xl p-6 border ${getBorderColor()} shadow-xl backdrop-blur-sm`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: isTyping ? 360 : 0 }}
                transition={{ duration: 2, repeat: isTyping ? Infinity : 0, ease: "linear" }}
                className={`p-2 rounded-lg bg-gradient-to-r ${typeColor}`}
              >
                <TypeIcon className="h-4 w-4 text-white" />
              </motion.div>
              <div>
                <h3 className={`text-lg font-semibold ${getTextColor()}`}>
                  {isEditingType ? 'Comandos de IA' : 'Prompt'} Aprimorado
                </h3>
                <p className={`text-sm ${getSubtextColor()}`}>
                  {typeDescription}
                </p>
              </div>
              {isTyping && (
                <motion.div
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="ml-2"
                >
                  <div className={`h-1 w-1 ${
                    isEditingType ? 'bg-emerald-500' : 
                    isMediaType ? 'bg-indigo-500' : 'bg-purple-500'
                  } rounded-full`} />
                </motion.div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                onClick={toggleFullText}
                className={`p-2 ${getSubtextColor()} ${
                  isEditingType ? 'hover:bg-emerald-100 dark:hover:bg-emerald-800' :
                  isMediaType ? 'hover:bg-indigo-100 dark:hover:bg-indigo-800' : 
                  'hover:bg-purple-100 dark:hover:bg-purple-800'
                } rounded-lg transition-colors duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={showFullText ? "Mostrar efeito de digitação" : "Mostrar texto completo"}
              >
                <RotateCcw className="h-4 w-4" />
              </motion.button>
              
              <motion.button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${typeColor} text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span className="text-sm font-medium">Copiar</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Enhanced Prompt Text */}
          <div className="relative">
            <motion.div
              className={`text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap font-mono text-sm p-4 bg-white/50 dark:bg-gray-900/30 rounded-xl border ${
                isEditingType ? 'border-emerald-100 dark:border-emerald-800' :
                isMediaType ? 'border-indigo-100 dark:border-indigo-800' : 
                'border-purple-100 dark:border-purple-800'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {showFullText ? prompt : displayedText}
              {isTyping && !showFullText && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className={`inline-block w-2 h-5 ${
                    isEditingType ? 'bg-emerald-500' :
                    isMediaType ? 'bg-indigo-500' : 'bg-purple-500'
                  } ml-1`}
                />
              )}
            </motion.div>
            
            {/* Character count and stats */}
            <div className={`flex items-center justify-between mt-3 text-xs ${getSubtextColor()}`}>
              <div className="flex items-center gap-4">
                <span>
                  {prompt.length} caracteres • {prompt.split(' ').length} palavras
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${typeColor} text-white`}>
                  {typeLabel}
                </span>
              </div>
              <span>
                ~{Math.ceil(prompt.length / 4)} tokens
              </span>
            </div>
          </div>

          {/* Enhancement Quality Indicators */}
          <motion.div
            className={`mt-4 flex items-center justify-center gap-4 text-xs ${getSubtextColor()}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Estruturado</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Contextualizado</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 ${
                isEditingType ? 'bg-emerald-500' :
                isMediaType ? 'bg-indigo-500' : 'bg-purple-500'
              } rounded-full`}></div>
              <span>
                {isEditingType ? 'Otimizado para IA de Edição' : 
                 isMediaType ? 'Otimizado para Mídia' : 'Otimizado para LLM'}
              </span>
            </div>
          </motion.div>

          {/* Type-specific tips */}
          {(isMediaType || isEditingType) && (
            <motion.div
              className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Dica:</strong> {
                    enhancementType === 'image' 
                      ? 'Use este prompt em ferramentas como DALL-E, Midjourney, Stable Diffusion ou Leonardo AI para melhores resultados.'
                    : enhancementType === 'video'
                      ? 'Use este prompt em ferramentas como RunwayML, Pika Labs, ou Stable Video Diffusion para criar vídeos incríveis.'
                    : enhancementType === 'image-editing'
                      ? 'Use estes comandos em ferramentas de IA como Photoshop AI, Canva AI, Remove.bg, ou Upscale.media.'
                    : 'Execute estes comandos em ferramentas de IA como RunwayML, Kapwing AI, Descript, ou outros editores com IA.'
                  }
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};