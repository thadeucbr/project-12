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
  { id: 'detailed' as const, label: 'Detailed', icon: Type, color: 'from-blue-500 to-cyan-500' },
  { id: 'creative' as const, label: 'Creative', icon: Lightbulb, color: 'from-purple-500 to-pink-500' },
  { id: 'technical' as const, label: 'Technical', icon: Code, color: 'from-green-500 to-emerald-500' },
  { id: 'concise' as const, label: 'Concise', icon: Target, color: 'from-orange-500 to-red-500' }
];

export const PromptInput: React.FC<PromptInputProps> = ({ 
  onSubmit, 
  isLoading, 
  initialValue = '' 
}) => {
  const [input, setInput] = useState(initialValue);
  const [selectedType, setSelectedType] = useState<Prompt['enhancementType']>('detailed');
  const [showSuggestions, setShowSuggestions] = useState(false);
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

  const characterCount = input.length;
  const isNearLimit = characterCount > 800;
  const isAtLimit = characterCount >= 1000;

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
          className="flex flex-wrap gap-2 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {enhancementTypes.map((type) => (
            <motion.button
              key={type.id}
              type="button"
              onClick={() => setSelectedType(type.id)}
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
              placeholder="Describe what you want to create, and I'll enhance it into a powerful prompt..."
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
              className="absolute bottom-4 right-4 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
                  Quick start ideas:
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
      </form>
    </motion.div>
  );
};