import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Sparkles, RotateCcw, Type, Code, Lightbulb, Target, Wand2, Scissors, Download, Share2, Eye, Brush, Heart, ShoppingBag, Film, FileText, Play, Store } from 'lucide-react';
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
  'image-realistic': Eye,
  'image-artistic': Brush,
  'image-anime': Heart,
  'image-commercial': ShoppingBag,
  'video-cinematic': Film,
  'video-documentary': FileText,
  'video-animated': Play,
  'video-commercial': Store,
  'image-editing': Wand2,
  'video-editing': Scissors
};

const typeColors = {
  detailed: 'from-blue-500 to-cyan-500',
  creative: 'from-purple-500 to-pink-500',
  technical: 'from-green-500 to-emerald-500',
  concise: 'from-orange-500 to-red-500',
  'image-realistic': 'from-blue-600 to-indigo-600',
  'image-artistic': 'from-purple-600 to-pink-600',
  'image-anime': 'from-pink-500 to-rose-500',
  'image-commercial': 'from-orange-600 to-red-600',
  'video-cinematic': 'from-slate-600 to-gray-700',
  'video-documentary': 'from-blue-700 to-indigo-700',
  'video-animated': 'from-purple-700 to-pink-700',
  'video-commercial': 'from-green-700 to-emerald-700',
  'image-editing': 'from-emerald-500 to-teal-500',
  'video-editing': 'from-violet-500 to-indigo-600'
};

const typeLabels = {
  detailed: 'Detalhado',
  creative: 'Criativo',
  technical: 'Técnico',
  concise: 'Conciso',
  'image-realistic': 'Imagem Realista',
  'image-artistic': 'Imagem Artística',
  'image-anime': 'Imagem Anime/Desenho',
  'image-commercial': 'Imagem Comercial',
  'video-cinematic': 'Vídeo Cinematográfico',
  'video-documentary': 'Vídeo Documentário',
  'video-animated': 'Vídeo Animado',
  'video-commercial': 'Vídeo Comercial',
  'image-editing': 'Edição de Imagem com IA',
  'video-editing': 'Edição de Vídeo com IA'
};

const typeDescriptions = {
  detailed: 'Prompt detalhado e abrangente',
  creative: 'Prompt criativo e inovador',
  technical: 'Prompt técnico e preciso',
  concise: 'Prompt direto e objetivo',
  'image-realistic': 'Otimizado para imagens fotorrealistas',
  'image-artistic': 'Especializado em arte digital e estilos artísticos',
  'image-anime': 'Focado em estilo anime, manga e desenho japonês',
  'image-commercial': 'Direcionado para uso comercial e marketing',
  'video-cinematic': 'Qualidade cinematográfica com narrativa visual',
  'video-documentary': 'Estilo documental informativo e educacional',
  'video-animated': 'Animações e motion graphics dinâmicos',
  'video-commercial': 'Conteúdo promocional e publicitário',
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
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    if (isVisible && prompt) {
      setIsTyping(true);
      setDisplayedText('');
      setShowFullText(false);
      
      let index = 0;
      const typingSpeed = 15; // milliseconds per character
      
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

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Prompt Aprimorado - Prompts Barbudas',
          text: prompt,
        });
      } else {
        // Fallback para desktop
        await navigator.clipboard.writeText(prompt);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      }
    } catch (error) {
      console.error('Falha ao compartilhar:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-${enhancementType}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const typewriterReplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const toggleFullText = () => {
    // Always clear any existing interval before potentially starting a new one
    if (typewriterReplayIntervalRef.current) {
      clearInterval(typewriterReplayIntervalRef.current);
      typewriterReplayIntervalRef.current = null;
    }

    setShowFullText(!showFullText);

    if (!showFullText) { // If currently showing full text, switch to typewriter
      setDisplayedText('');
      setIsTyping(true);
      let index = 0;
      const typingSpeed = 8; // Faster speed for replay
      
      typewriterReplayIntervalRef.current = setInterval(() => {
        if (index < prompt.length) {
          setDisplayedText(prompt.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          if (typewriterReplayIntervalRef.current) { // Clear when typing is complete
            clearInterval(typewriterReplayIntervalRef.current);
            typewriterReplayIntervalRef.current = null;
          }
        }
      }, typingSpeed);
    } else { // If currently showing typewriter, switch to full text
      setDisplayedText(prompt);
      setIsTyping(false);
    }
  };

  // Cleanup for typewriterReplayIntervalRef on unmount
  useEffect(() => {
    return () => {
      if (typewriterReplayIntervalRef.current) {
        clearInterval(typewriterReplayIntervalRef.current);
      }
    };
  }, []);

  if (!isVisible || !prompt) return null;

  const TypeIcon = typeIcons[enhancementType];
  const typeColor = typeColors[enhancementType];
  const typeLabel = typeLabels[enhancementType];
  const typeDescription = typeDescriptions[enhancementType];

  const isImageType = enhancementType.startsWith('image-');
  const isVideoType = enhancementType.startsWith('video-');
  const isEditingType = enhancementType.includes('-editing');
  const isAnimeType = enhancementType === 'image-anime';

  const getBackgroundGradient = () => {
    if (isEditingType) {
      return 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20';
    }
    if (isAnimeType) {
      return 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20';
    }
    if (isImageType) {
      return 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20';
    }
    if (isVideoType) {
      return 'from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20';
    }
    return 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20';
  };

  const getBorderColor = () => {
    if (isEditingType) {
      return 'border-emerald-200 dark:border-emerald-700';
    }
    if (isAnimeType) {
      return 'border-pink-200 dark:border-pink-700';
    }
    if (isImageType) {
      return 'border-blue-200 dark:border-blue-700';
    }
    if (isVideoType) {
      return 'border-slate-200 dark:border-slate-700';
    }
    return 'border-purple-200 dark:border-purple-700';
  };

  const getTextColor = () => {
    if (isEditingType) {
      return 'text-emerald-800 dark:text-emerald-200';
    }
    if (isAnimeType) {
      return 'text-pink-800 dark:text-pink-200';
    }
    if (isImageType) {
      return 'text-blue-800 dark:text-blue-200';
    }
    if (isVideoType) {
      return 'text-slate-800 dark:text-slate-200';
    }
    return 'text-purple-800 dark:text-purple-200';
  };

  const getSubtextColor = () => {
    if (isEditingType) {
      return 'text-emerald-600 dark:text-emerald-400';
    }
    if (isAnimeType) {
      return 'text-pink-600 dark:text-pink-400';
    }
    if (isImageType) {
      return 'text-blue-600 dark:text-blue-400';
    }
    if (isVideoType) {
      return 'text-slate-600 dark:text-slate-400';
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
        className="w-full max-w-4xl mx-auto mt-6 sm:mt-8"
      >
        <motion.div
          className={`bg-gradient-to-br ${getBackgroundGradient()} rounded-2xl p-4 sm:p-6 border-2 ${getBorderColor()} shadow-xl backdrop-blur-sm`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Header */}
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
                  {typeDescription}
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

          {/* Enhanced Prompt Text */}
          <div className="relative">
            <motion.div
              className={`text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap font-mono text-sm sm:text-sm p-4 sm:p-6 bg-white/60 dark:bg-gray-900/40 rounded-xl border ${
                isEditingType ? 'border-emerald-100 dark:border-emerald-800' :
                isAnimeType ? 'border-pink-100 dark:border-pink-800' :
                isImageType ? 'border-blue-100 dark:border-blue-800' :
                isVideoType ? 'border-slate-100 dark:border-slate-800' : 
                'border-purple-100 dark:border-purple-800'
              } backdrop-blur-sm`}
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
                    isAnimeType ? 'bg-pink-500' :
                    isImageType ? 'bg-blue-500' :
                    isVideoType ? 'bg-slate-500' : 'bg-purple-500'
                  } ml-1`}
                />
              )}
            </motion.div>
            
            {/* Character count and stats */}
            <div className={`flex items-center justify-between mt-3 sm:mt-4 text-xs ${getSubtextColor()}`}>
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <span>
                  {prompt.length} caracteres • {prompt.split(' ').length} palavras
                </span>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${typeColor} text-white`}>
                  {typeLabel}
                </span>
              </div>
              <span className="hidden sm:inline">
                ~{Math.ceil(prompt.length / 4)} tokens
              </span>
            </div>
          </div>

          {/* Enhancement Quality Indicators */}
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

          {/* Type-specific tips */}
          {(isImageType || isVideoType || isEditingType) && (
            <motion.div
              className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-start gap-3">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                  <strong>Dica:</strong> {
                    isAnimeType
                      ? 'Use este prompt em ferramentas como NovelAI, Waifu Diffusion, Anything V3, ou outros modelos especializados em anime para melhores resultados.'
                    : isImageType
                      ? 'Use este prompt em ferramentas como DALL-E, Midjourney, Stable Diffusion ou Leonardo AI para melhores resultados.'
                    : isVideoType
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