import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Zap, Type, Code, Lightbulb, Target, Image, Video, Palette, Camera, Edit, Scissors, Wand2 } from 'lucide-react';
import type { Prompt } from '../types';

interface PromptInputProps {
  onSubmit: (prompt: string, enhancementType: Prompt['enhancementType']) => void;
  isLoading: boolean;
  initialValue?: string;
}

const enhancementTypes = [
  { 
    id: 'detailed' as const, 
    label: 'Detalhado', 
    icon: Type, 
    color: 'from-blue-500 to-cyan-500',
    description: 'Cria prompts abrangentes com instruções passo a passo e contexto detalhado',
    category: 'text'
  },
  { 
    id: 'creative' as const, 
    label: 'Criativo', 
    icon: Lightbulb, 
    color: 'from-purple-500 to-pink-500',
    description: 'Gera prompts inovadores que estimulam pensamento criativo e soluções originais',
    category: 'text'
  },
  { 
    id: 'technical' as const, 
    label: 'Técnico', 
    icon: Code, 
    color: 'from-green-500 to-emerald-500',
    description: 'Produz prompts técnicos precisos com especificações e melhores práticas',
    category: 'text'
  },
  { 
    id: 'concise' as const, 
    label: 'Conciso', 
    icon: Target, 
    color: 'from-orange-500 to-red-500',
    description: 'Cria prompts diretos e objetivos focados em resultados imediatos',
    category: 'text'
  },
  { 
    id: 'image' as const, 
    label: 'Geração de Imagem', 
    icon: Image, 
    color: 'from-pink-500 to-rose-500',
    description: 'Otimiza prompts para geração de imagens com detalhes visuais específicos',
    category: 'image'
  },
  { 
    id: 'video' as const, 
    label: 'Geração de Vídeo', 
    icon: Video, 
    color: 'from-indigo-500 to-purple-600',
    description: 'Especializa prompts para criação de vídeos com movimento e narrativa temporal',
    category: 'video'
  },
  { 
    id: 'image-editing' as const, 
    label: 'Edição de Imagem com IA', 
    icon: Wand2, 
    color: 'from-emerald-500 to-teal-500',
    description: 'Prompts para IAs de edição de imagem como Photoshop AI, Canva AI, Remove.bg',
    category: 'editing'
  },
  { 
    id: 'video-editing' as const, 
    label: 'Edição de Vídeo com IA', 
    icon: Scissors, 
    color: 'from-violet-500 to-indigo-600',
    description: 'Prompts para IAs de edição de vídeo como RunwayML, Kapwing AI, Descript',
    category: 'editing'
  }
];

const categoryLabels = {
  text: 'Texto',
  image: 'Geração de Imagem',
  video: 'Geração de Vídeo',
  editing: 'Edição com IA'
};

const categoryIcons = {
  text: Type,
  image: Palette,
  video: Camera,
  editing: Wand2
};

export const PromptInput: React.FC<PromptInputProps> = ({ 
  onSubmit, 
  isLoading, 
  initialValue = '' 
}) => {
  const [input, setInput] = useState(initialValue);
  const [selectedType, setSelectedType] = useState<Prompt['enhancementType']>('detailed');
  const [selectedCategory, setSelectedCategory] = useState<'text' | 'image' | 'video' | 'editing'>('text');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showTypeInfo, setShowTypeInfo] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = {
    text: [
      "Escreva um email profissional para...",
      "Crie uma estratégia de marketing para...",
      "Desenvolva um guia técnico para...",
      "Projete uma interface de usuário para...",
      "Analise as tendências de mercado de..."
    ],
    image: [
      "Uma paisagem urbana futurista ao pôr do sol com carros voadores",
      "Retrato de um sábio mago idoso com olhos brilhantes",
      "Design de logo minimalista para uma startup de tecnologia",
      "Arte abstrata representando transformação digital",
      "Fotografia de produto de um relógio de luxo"
    ],
    video: [
      "Time-lapse de uma flor desabrochando na primavera",
      "Trailer cinematográfico para uma aventura de ficção científica",
      "Tutorial mostrando como cozinhar macarrão",
      "Revelação de logo animado com efeitos de partículas",
      "Configuração de entrevista estilo documentário"
    ],
    editing: [
      "Remover fundo de foto de produto usando IA",
      "Melhorar foto de retrato com filtros de beleza IA",
      "Corrigir cores de vídeo do pôr do sol automaticamente",
      "Gerar transições suaves entre clipes",
      "Aumentar resolução de foto antiga para 4K usando IA"
    ]
  };

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

  const handleCategorySelect = (category: 'text' | 'image' | 'video' | 'editing') => {
    setSelectedCategory(category);
    setShowSuggestions(false);
  };

  const characterCount = input.length;
  const isNearLimit = characterCount > 800;
  const isAtLimit = characterCount >= 1000;

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
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Selector */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tipo de Conteúdo:
          </h3>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(categoryLabels).map(([key, label]) => {
              const Icon = categoryIcons[key as keyof typeof categoryIcons];
              return (
                <motion.button
                  key={key}
                  type="button"
                  onClick={() => handleCategorySelect(key as 'text' | 'image' | 'video' | 'editing')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === key
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Enhancement Type Selector */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <CategoryIcon className="h-4 w-4" />
              Estilo de Aprimoramento:
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
            {filteredTypes.map((type) => (
              <motion.button
                key={type.id}
                type="button"
                onClick={() => handleTypeSelect(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedType === type.id
                    ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
                      Aprimoramento {selectedTypeInfo.label}
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
              placeholder={getPlaceholder()}
              className="w-full p-6 pb-16 text-lg bg-transparent border-none outline-none resize-none min-h-[120px] max-h-[300px] overflow-y-auto placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
              maxLength={1000}
              disabled={isLoading}
            />
            
            {/* Character Count */}
            <div className={`absolute bottom-4 left-6 text-sm ${
              isAtLimit ? 'text-red-500' : isNearLimit ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'
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
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 px-2 flex items-center gap-2">
                  <CategoryIcon className="h-3 w-3" />
                  Ideias para {categoryLabels[selectedCategory].toLowerCase()}:
                </p>
                {suggestions[selectedCategory].map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150 text-gray-700 dark:text-gray-300"
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
              Seu prompt será aprimorado para: <span className="font-medium text-purple-600 dark:text-purple-400">{categoryLabels[selectedCategory]} - {selectedTypeInfo.label}</span>
            </p>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};