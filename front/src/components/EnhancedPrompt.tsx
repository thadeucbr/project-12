import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Sparkles, RotateCcw, Type, Code, Lightbulb, Target } from 'lucide-react';
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
  concise: Target
};

const typeColors = {
  detailed: 'from-blue-500 to-cyan-500',
  creative: 'from-purple-500 to-pink-500',
  technical: 'from-green-500 to-emerald-500',
  concise: 'from-orange-500 to-red-500'
};

const typeLabels = {
  detailed: 'Detailed',
  creative: 'Creative',
  technical: 'Technical',
  concise: 'Concise'
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
      console.error('Failed to copy text:', error);
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
          className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700 shadow-xl backdrop-blur-sm"
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
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                  Enhanced Prompt
                </h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Estilo: {typeLabel}
                </p>
              </div>
              {isTyping && (
                <motion.div
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="ml-2"
                >
                  <div className="h-1 w-1 bg-purple-500 rounded-full" />
                </motion.div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                onClick={toggleFullText}
                className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800 rounded-lg transition-colors duration-200"
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
              className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap font-mono text-sm p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-purple-100 dark:border-purple-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {showFullText ? prompt : displayedText}
              {isTyping && !showFullText && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-2 h-5 bg-purple-500 ml-1"
                />
              )}
            </motion.div>
            
            {/* Character count and stats */}
            <div className="flex items-center justify-between mt-3 text-xs text-purple-600 dark:text-purple-400">
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
            className="mt-4 flex items-center justify-center gap-4 text-xs text-purple-600 dark:text-purple-400"
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
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Otimizado para LLM</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};