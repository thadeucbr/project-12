import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { PromptSuggestions } from '../../PromptSuggestions';
import type { Prompt } from '../../../types';

interface PromptInputAreaProps {
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  focusedInput: boolean;
  setFocusedInput: (focused: boolean) => void;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  selectedCategory: 'text' | 'image' | 'video' | 'editing';
  selectedTypeInfo: { id: Prompt['enhancementType']; label: string; color: string; description: string; category: string; icon: React.ElementType } | undefined;
  handleSubmit: (e: React.FormEvent) => void;
  handleSuggestionClick: (suggestion: string) => void;
}

export const PromptInputArea: React.FC<PromptInputAreaProps> = ({
  input,
  setInput,
  isLoading,
  focusedInput,
  setFocusedInput,
  showSuggestions,
  setShowSuggestions,
  textareaRef,
  selectedCategory,
  selectedTypeInfo,
  handleSubmit,
  handleSuggestionClick,
}) => {
  const handleInputFocus = () => {
    setFocusedInput(true);
    if (input.trim() === '') {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setFocusedInput(false);
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.trim() === '' && focusedInput) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const characterCount = input.length;
  const isNearLimit = characterCount > 4000;
  const isAtLimit = characterCount >= 5000;

  const getPlaceholder = () => {
    const placeholders = {
      text: `Descreva o que você quer criar e eu vou aprimorar usando o estilo ${selectedTypeInfo?.label.toLowerCase()}...`,
      image: `Descreva a imagem que você quer gerar (ex: "um gato fofo dormindo em uma cama")...`,
      video: `Descreva o vídeo que você quer criar (ex: "uma pessoa caminhando na praia ao pôr do sol")...`,
      editing: `Descreva a edição que você quer fazer com IA (ex: "remover fundo da foto usando IA")...`
    };
    return placeholders[selectedCategory];
  };

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 transition-all duration-200 overflow-hidden ${
        focusedInput 
          ? 'border-indigo-500 dark:border-indigo-400 shadow-2xl' 
          : 'border-gray-200 dark:border-gray-700'
      }`}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={getPlaceholder()}
          className="w-full p-4 sm:p-6 pb-16 sm:pb-20 text-base sm:text-lg bg-transparent border-none outline-none resize-none min-h-[120px] sm:min-h-[140px] max-h-[250px] sm:max-h-[300px] overflow-y-auto placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
          maxLength={5000}
          disabled={isLoading}
        />
        
        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            {/* Character Count */}
            <div className={`text-xs sm:text-sm flex items-center gap-2 ${
              isAtLimit ? 'text-red-500' : isNearLimit ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'
            }`}>
              <span>{characterCount}/5000</span>
              {characterCount > 0 && (
                <span className="text-xs hidden sm:inline">• ~{Math.ceil(characterCount / 4)} tokens</span>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading || isAtLimit}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r ${selectedTypeInfo?.color} text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm sm:text-base`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={`Aprimorar com estilo ${selectedTypeInfo?.label}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  <span className="hidden sm:inline">Aprimorando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Aprimorar</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <PromptSuggestions
        isVisible={showSuggestions}
        selectedCategory={selectedCategory}
        onSuggestionClick={handleSuggestionClick}
      />
    </motion.div>
  );
};
