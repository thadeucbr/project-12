import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Zap, Type, Code, Lightbulb, Target, Image, Video, Palette, Camera, Edit, Scissors, Wand2, Sparkles, Eye, Brush, Heart, ShoppingBag, Film, FileText, Play, Store } from 'lucide-react';
import type { Prompt } from '../types';

interface PromptInputProps {
  onSubmit: (prompt: string, enhancementType: Prompt['enhancementType']) => void;
  isLoading: boolean;
  initialValue?: string;
}

const enhancementTypes = [
  // Text Types
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
  
  // Image Types
  { 
    id: 'image-realistic' as const, 
    label: 'Realista', 
    icon: Eye, 
    color: 'from-blue-600 to-indigo-600',
    description: 'Prompts para imagens fotorrealistas com detalhes precisos e iluminação natural',
    category: 'image'
  },
  { 
    id: 'image-artistic' as const, 
    label: 'Artístico', 
    icon: Brush, 
    color: 'from-purple-600 to-pink-600',
    description: 'Prompts para arte digital, pinturas e estilos artísticos únicos',
    category: 'image'
  },
  { 
    id: 'image-anime' as const, 
    label: 'Desenho/Anime', 
    icon: Heart, 
    color: 'from-pink-500 to-rose-500',
    description: 'Prompts para estilo anime, manga, desenho animado e ilustrações japonesas',
    category: 'image'
  },
  { 
    id: 'image-commercial' as const, 
    label: 'Comercial', 
    icon: ShoppingBag, 
    color: 'from-orange-600 to-red-600',
    description: 'Prompts para fotografia de produto, marketing e uso comercial',
    category: 'image'
  },
  
  // Video Types
  { 
    id: 'video-cinematic' as const, 
    label: 'Cinematográfico', 
    icon: Film, 
    color: 'from-slate-600 to-gray-700',
    description: 'Prompts para vídeos com qualidade cinematográfica e narrativa visual',
    category: 'video'
  },
  { 
    id: 'video-documentary' as const, 
    label: 'Documentário', 
    icon: FileText, 
    color: 'from-blue-700 to-indigo-700',
    description: 'Prompts para vídeos informativos, educacionais e documentários',
    category: 'video'
  },
  { 
    id: 'video-animated' as const, 
    label: 'Animado', 
    icon: Play, 
    color: 'from-purple-700 to-pink-700',
    description: 'Prompts para animações, motion graphics e conteúdo animado',
    category: 'video'
  },
  { 
    id: 'video-commercial' as const, 
    label: 'Comercial', 
    icon: Store, 
    color: 'from-green-700 to-emerald-700',
    description: 'Prompts para vídeos promocionais, publicitários e de marketing',
    category: 'video'
  },
  
  // Editing Types
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
  const [focusedInput, setFocusedInput] = useState(false);
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
      "Uma garota anime com cabelos rosa em um jardim de cerejeiras",
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selector */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Escolha o tipo de conteúdo
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Selecione a categoria que melhor descreve o que você quer criar
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(categoryLabels).map(([key, label]) => {
              const Icon = categoryIcons[key as keyof typeof categoryIcons];
              const isSelected = selectedCategory === key;
              return (
                <motion.button
                  key={key}
                  type="button"
                  onClick={() => handleCategorySelect(key as 'text' | 'image' | 'video' | 'editing')}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                    isSelected
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-500 shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md'
                  }`}
                  whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`h-6 w-6 ${isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                  <span className="text-center leading-tight">{label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Enhancement Type Selector */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center justify-center gap-2">
              <CategoryIcon className="h-5 w-5" />
              Estilo de aprimoramento
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {selectedCategory === 'image' && 'Escolha o estilo visual que melhor se adequa ao seu projeto'}
              {selectedCategory === 'video' && 'Selecione o formato de vídeo que você deseja criar'}
              {selectedCategory === 'text' && 'Como você gostaria que seu prompt fosse otimizado?'}
              {selectedCategory === 'editing' && 'Tipo de edição com IA que você quer realizar'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredTypes.map((type) => {
              const isSelected = selectedType === type.id;
              return (
                <motion.button
                  key={type.id}
                  type="button"
                  onClick={() => handleTypeSelect(type.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium transition-all duration-200 border-2 text-left ${
                    isSelected
                      ? `bg-gradient-to-r ${type.color} text-white border-transparent shadow-lg`
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : `bg-gradient-to-r ${type.color}`}`}>
                    <type.icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-white'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{type.label}</div>
                    <div className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                      {type.description.split(' ').slice(0, 6).join(' ')}...
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Input Area */}
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
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => {
                setFocusedInput(true);
                setShowSuggestions(input.length === 0);
              }}
              onBlur={() => {
                setFocusedInput(false);
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              placeholder={getPlaceholder()}
              className="w-full p-6 pb-20 text-lg bg-transparent border-none outline-none resize-none min-h-[140px] max-h-[300px] overflow-y-auto placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
              maxLength={1000}
              disabled={isLoading}
            />
            
            {/* Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                {/* Character Count */}
                <div className={`text-sm flex items-center gap-2 ${
                  isAtLimit ? 'text-red-500' : isNearLimit ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  <span>{characterCount}/1000</span>
                  {characterCount > 0 && (
                    <span className="text-xs">• ~{Math.ceil(characterCount / 4)} tokens</span>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isLoading || isAtLimit}
                  className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${selectedTypeInfo?.color} text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 font-medium`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={`Aprimorar com estilo ${selectedTypeInfo?.label}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Aprimorando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Aprimorar</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Quick Start Suggestions */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full mt-4 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-10"
              >
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                  <CategoryIcon className="h-4 w-4" />
                  <span>Ideias para {categoryLabels[selectedCategory].toLowerCase()}:</span>
                </div>
                <div className="space-y-2">
                  {suggestions[selectedCategory].map((suggestion, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left p-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150 text-gray-700 dark:text-gray-300 flex items-start gap-3"
                      whileHover={{ x: 4 }}
                    >
                      <Zap className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </motion.button>
                  ))}
                </div>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full border border-indigo-200 dark:border-indigo-700">
              <selectedTypeInfo.icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                {categoryLabels[selectedCategory]} • {selectedTypeInfo.label}
              </span>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};