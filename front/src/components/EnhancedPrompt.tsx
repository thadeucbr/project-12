import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { typeIcons, typeColors, typeLabels, typeDescriptions } from '../utils/promptConstants';
import type { Prompt } from '../types';
import { Copy, Check, Sparkles, RotateCcw, Download, Share2 } from 'lucide-react';
import { EnhancedPromptHeader } from './EnhancedPrompt/components/EnhancedPromptHeader';
import { EnhancedPromptTextDisplay } from './EnhancedPrompt/components/EnhancedPromptTextDisplay';
import { EnhancedPromptQualityIndicators } from './EnhancedPrompt/components/EnhancedPromptQualityIndicators';
import { EnhancedPromptTips } from './EnhancedPrompt/components/EnhancedPromptTips';

interface EnhancedPromptProps {
  prompt: string;
  isVisible: boolean;
  onCopy?: () => void;
  enhancementType?: Prompt['enhancementType'];
}

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
          <EnhancedPromptHeader
            enhancementType={enhancementType}
            isTyping={isTyping}
            isCopied={isCopied}
            isShared={isShared}
            showFullText={showFullText}
            handleCopy={handleCopy}
            handleDownload={handleDownload}
            handleShare={handleShare}
            toggleFullText={toggleFullText}
            getTextColor={getTextColor}
            getSubtextColor={getSubtextColor}
            typeColor={typeColor}
            isEditingType={isEditingType}
            isAnimeType={isAnimeType}
            isImageType={isImageType}
            isVideoType={isVideoType}
          />

          <EnhancedPromptTextDisplay
            prompt={prompt}
            displayedText={displayedText}
            isTyping={isTyping}
            showFullText={showFullText}
            isEditingType={isEditingType}
            isAnimeType={isAnimeType}
            isImageType={isImageType}
            isVideoType={isVideoType}
            getSubtextColor={getSubtextColor}
            typeColor={typeColor}
            enhancementType={enhancementType}
          />

          <EnhancedPromptQualityIndicators
            getSubtextColor={getSubtextColor}
            isEditingType={isEditingType}
            isAnimeType={isAnimeType}
            isImageType={isImageType}
            isVideoType={isVideoType}
          />

          <EnhancedPromptTips
            enhancementType={enhancementType}
            isImageType={isImageType}
            isVideoType={isVideoType}
            isEditingType={isEditingType}
            isAnimeType={isAnimeType}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};