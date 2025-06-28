import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Zap, Type, Code, Lightbulb, Target } from 'lucide-react';
import type { Prompt } from '../types';

interface PromptInputProps {
  onSubmit: (prompt: string, enhancementType: Prompt['enhancementType']) => void;
  isLoading: boolean;
  initialValue?: string;
}

const enhancementTypes = [
  { 
    id: 'detailed' as const, 
    label: 'Detailed', 
    icon: Type, 
    color: 'from-blue-500 to-cyan-500',
    description: 'Cria prompts abrangentes com instruções passo a passo e contexto detalhado'
  },
  { 
    id: 'creative' as const, 
    label: 'Creative', 
    icon: Lightbulb, 
    color: 'from-purple-500 to-pink-500',
    description: 'Gera prompts inovadores que estimulam pensamento criativo e soluções originais'
  },
  { 
    id: 'technical' as const, 
    label: 'Technical', 
    icon: Code, 
    color: 'from-green-500 to-emerald-500',
    description: 'Produz prompts técnicos precisos com especificações e melhores práticas'
  },
  { 
    id: 'concise' as const, 
    label: 'Concise', 
    icon: Target, 
    color: 'from-orange-500 to-red-500',
    description: 'Cria prompts diretos e objetivos focados em resultados imediatos'
  }
];

export const PromptInput: React.FC<PromptInputProps> = ({ 
  onSubmit, 
  isLoading, 
  initialValue = '' 
}) => {
  const [input, setInput] = useState(initialValue);
  const [selectedType, setSelectedType] = useState<Prompt['enhancementType']>('detailed');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showTypeInfo, setShowTypeInfo] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = [
    "Write a professional email to...",
    "Create a marketing strategy for...",
    "Develop a technical guide for...",
    "Design a user interface for...",
    "Analyze the market trends of..."
  ];

  useEffect(() => {
    if (initialValue) {
      setInput(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim(), selectedType);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const handleTypeSelect = (type: Prompt['enhancementType']) => {
    setSelectedType(type);
    setShowTypeInfo(false);
  };

  const characterCount = input.length;
  const isNearLimit = characterCount > 800;
  const isAtLimit = characterCount >= 1000;

  const selectedTypeInfo = enhancementTypes.find(type => type.id === selectedType);

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Enhancement Type Selector */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo de Aprimoramento:
            </h3>
            <button
              type="button"
              onClick={() => setShowTypeInfo(!showTypeInfo)}
              className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              {showTypeInfo ? 'Ocultar detalhes' : 'Ver detalhes'}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {enhancementTypes.map((type) => (
              <motion.button
                key={type.id}
                type="button"
                onClick={() => handleTypeSelect(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedType === type.id
                    ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <type.icon className="h-4 w-4" />
                {type.label}
              </motion.button>
            ))}
          </div>

          {/* Type Information Panel */}
          <AnimatePresence>
            {showTypeInfo && selectedTypeInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedTypeInfo.color}`}>
                    <selectedTypeInfo.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">
                      {selectedTypeInfo.label} Enhancement
                    </h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      {selectedTypeInfo.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Input Area */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setShowSuggestions(input.length === 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={`Descreva o que você quer criar e eu vou aprimorar usando o estilo ${selectedTypeInfo?.label.toLowerCase()}...`}
              className="w-full p-6 pb-16 text-lg bg-transparent border-none outline-none resize-none min-h-[120px] max-h-[300px] overflow-y-auto placeholder-gray-400 dark:placeholder-gray-500"
              maxLength={1000}
              disabled={isLoading}
            />
            
            {/* Character Count */}
            <div className={`absolute bottom-4 left-6 text-sm ${
              isAtLimit ? 'text-red-500' : isNearLimit ? 'text-orange-500' : 'text-gray-400'
            }`}>
              {characterCount}/1000
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading || isAtLimit}
              className={`absolute bottom-4 right-4 p-3 bg-gradient-to-r ${selectedTypeInfo?.color} text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={`Aprimorar com estilo ${selectedTypeInfo?.label}`}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </motion.button>
          </div>

          {/* Quick Start Suggestions */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 z-10"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 px-2">
                  Ideias para começar:
                </p>
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                    whileHover={{ x: 4 }}
                  >
                    <Zap className="h-3 w-3 inline mr-2 text-purple-500" />
                    {suggestion}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Enhancement Preview */}
        {selectedTypeInfo && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Seu prompt será aprimorado com foco em: <span className="font-medium text-purple-600 dark:text-purple-400">{selectedTypeInfo.label}</span>
            </p>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};