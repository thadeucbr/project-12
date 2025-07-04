import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, Type, Image, Video, Edit, Lightbulb, Code, Target, Brain } from 'lucide-react';

interface PromptSuggestionsProps {
  isVisible: boolean;
  selectedCategory: 'text' | 'image' | 'video' | 'editing';
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = {
  text: [
    "Escreva um email profissional para solicitar uma reunião com o cliente",
    "Crie uma estratégia de marketing digital para uma startup de tecnologia",
    "Desenvolva um guia técnico para implementar autenticação JWT",
    "Projete uma interface de usuário intuitiva para um aplicativo móvel",
    "Analise as tendências de mercado para veículos elétricos no Brasil",
    "Redija uma proposta comercial convincente para serviços de consultoria",
    "Elabore um plano de comunicação de crise para redes sociais",
    "Crie conteúdo educativo sobre inteligência artificial para iniciantes"
  ],
  image: [
    "Uma garota anime com cabelos rosa em um jardim de cerejeiras ao pôr do sol",
    "Retrato fotorrealista de um sábio mago idoso com olhos brilhantes e barba longa",
    "Design de logo minimalista para uma startup de tecnologia sustentável",
    "Arte abstrata representando transformação digital com cores vibrantes",
    "Fotografia de produto profissional de um relógio de luxo em mármore",
    "Paisagem cyberpunk futurista com arranha-céus e luzes neon",
    "Ilustração artística de um dragão majestoso voando sobre montanhas",
    "Cena cinematográfica de um astronauta explorando um planeta alienígena"
  ],
  video: [
    "Time-lapse de uma flor desabrochando desde a semente até a floração completa",
    "Trailer cinematográfico épico para uma aventura de ficção científica",
    "Tutorial passo a passo mostrando como preparar massa de pizza italiana",
    "Animação de logo com efeitos de partículas e transições suaves",
    "Documentário sobre vida selvagem com narração profissional",
    "Vídeo promocional dinâmico para lançamento de produto tecnológico",
    "Sequência de dança coreografada com iluminação dramática",
    "Apresentação corporativa com gráficos animados e transições elegantes"
  ],
  editing: [
    "Remover fundo de foto de produto e substituir por gradiente profissional",
    "Melhorar retrato usando IA para suavizar pele e realçar características",
    "Corrigir automaticamente cores de vídeo para look cinematográfico",
    "Gerar transições suaves entre clipes com efeitos de movimento",
    "Aumentar resolução de foto antiga para 4K mantendo qualidade",
    "Aplicar filtros de beleza naturais preservando autenticidade",
    "Estabilizar vídeo tremido e adicionar movimentos de câmera suaves",
    "Criar efeitos de texto animado para vídeos promocionais"
  ]
};

const categoryIcons = {
  text: Type,
  image: Image,
  video: Video,
  editing: Edit
};

const categoryLabels = {
  text: 'Texto',
  image: 'Geração de Imagem',
  video: 'Geração de Vídeo',
  editing: 'Edição com IA'
};

const suggestionIcons = {
  text: [Brain, Lightbulb, Code, Target, Sparkles, Zap, Type, Brain],
  image: [Image, Sparkles, Zap, Target, Lightbulb, Brain, Type, Code],
  video: [Video, Sparkles, Target, Zap, Lightbulb, Brain, Code, Type],
  editing: [Edit, Zap, Sparkles, Target, Brain, Lightbulb, Code, Type]
};

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({
  isVisible,
  selectedCategory,
  onSuggestionClick
}) => {
  const CategoryIcon = categoryIcons[selectedCategory];
  const categoryLabel = categoryLabels[selectedCategory];
  const categorySuggestions = suggestions[selectedCategory];
  const icons = suggestionIcons[selectedCategory];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full mt-4 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 z-20 backdrop-blur-sm"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <CategoryIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Ideias para {categoryLabel}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Clique em uma sugestão para começar rapidamente
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="ml-auto"
          >
            <Sparkles className="h-5 w-5 text-purple-500" />
          </motion.div>
        </div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
          {categorySuggestions.map((suggestion, index) => {
            const Icon = icons[index % icons.length];
            
            return (
              <motion.button
                key={index}
                onClick={() => onSuggestionClick(suggestion)}
                className="group flex items-start gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 border border-transparent hover:border-purple-200 dark:hover:border-purple-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg group-hover:from-purple-200 group-hover:to-pink-200 dark:group-hover:from-purple-800/40 dark:group-hover:to-pink-800/40 transition-all duration-200">
                  <Icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-200 line-clamp-2">
                    {suggestion}
                  </p>
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Zap className="h-3 w-3 text-purple-500" />
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      Usar esta ideia
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Lightbulb className="h-3 w-3" />
              <span>Dica: Você pode editar qualquer sugestão após selecioná-la</span>
            </div>
            <div className="flex items-center gap-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {categorySuggestions.length} sugestões disponíveis
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};