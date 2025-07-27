import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PromptSuggestions } from './PromptSuggestions';
import type { Prompt } from '../types';
import { enhancementTypes, categoryLabels, categoryIcons } from '../utils/promptConstants';
import { PromptCategorySelector } from './PromptInput/components/PromptCategorySelector';
import { PromptEnhancementTypeSelector } from './PromptInput/components/PromptEnhancementTypeSelector';
import { PromptInputArea } from './PromptInput/components/PromptInputArea';
import { PromptEnhancementPreview } from './PromptInput/components/PromptEnhancementPreview';


interface PromptInputProps {
  onSubmit: (prompt: string, enhancementType: Prompt['enhancementType']) => void;
  isLoading: boolean;
  initialValue?: string;
}

export const PromptInput: React.FC<PromptInputProps> = ({ 
  onSubmit, 
  isLoading, 
  initialValue = '' 
}) => {
  const [input, setInput] = useState(initialValue);
  const [selectedType, setSelectedType] = useState<Prompt['enhancementType']>('detailed');
  const [selectedCategory, setSelectedCategory] = useState<'text' | 'image' | 'video' | 'editing'>('text');
  const [focusedInput, setFocusedInput] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    // Atualiza o tipo selecionado quando a categoria muda
    const typesInCategory = enhancementTypes.filter(type => type.category === selectedCategory);
    if (typesInCategory.length > 0 && !typesInCategory.find(type => type.id === selectedType)) {
      setSelectedType(typesInCategory[0].id);
    }
  }, [selectedCategory, selectedType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim(), selectedType);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const handleTypeSelect = (type: Prompt['enhancementType']) => {
    setSelectedType(type);
  };

  const handleCategorySelect = (category: 'text' | 'image' | 'video' | 'editing') => {
    setSelectedCategory(category);
  };

  const handleInputFocus = () => {
    setFocusedInput(true);
    if (input.trim() === '') {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setFocusedInput(false);
    // Delay para permitir clique nas sugestões
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    
    // Mostra sugestões apenas quando o campo está vazio
    if (value.trim() === '' && focusedInput) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const characterCount = input.length;
  const isNearLimit = characterCount > 4000;
  const isAtLimit = characterCount >= 5000;

  const selectedTypeInfo = enhancementTypes.find(type => type.id === selectedType);
  const filteredTypes = enhancementTypes.filter(type => type.category === selectedCategory);
  const CategoryIcon = categoryIcons[selectedCategory];

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
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <PromptCategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        <PromptEnhancementTypeSelector
          selectedCategory={selectedCategory}
          selectedType={selectedType}
          onSelectType={handleTypeSelect}
        />

        <PromptInputArea
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          focusedInput={focusedInput}
          setFocusedInput={setFocusedInput}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          textareaRef={textareaRef}
          selectedCategory={selectedCategory}
          selectedTypeInfo={selectedTypeInfo}
          handleSubmit={handleSubmit}
          handleSuggestionClick={handleSuggestionClick}
        />

        <PromptEnhancementPreview
          selectedTypeInfo={selectedTypeInfo}
          selectedCategory={selectedCategory}
        />
      </form>
    </motion.div>
  );
};