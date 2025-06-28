import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Copy, 
  Check, 
  BarChart3, 
  Clock, 
  FileText,
  Zap,
  X
} from 'lucide-react';

interface ComparisonData {
  original: string;
  enhanced: string;
  enhancementType: string;
  timestamp: string;
}

interface PromptComparisonProps {
  data: ComparisonData;
  isOpen: boolean;
  onClose: () => void;
}

export const PromptComparison: React.FC<PromptComparisonProps> = ({
  data,
  isOpen,
  onClose
}) => {
  const [copiedSide, setCopiedSide] = useState<'original' | 'enhanced' | null>(null);

  const handleCopy = async (text: string, side: 'original' | 'enhanced') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSide(side);
      setTimeout(() => setCopiedSide(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const getStats = () => {
    const originalWords = data.original.split(' ').length;
    const enhancedWords = data.enhanced.split(' ').length;
    const originalChars = data.original.length;
    const enhancedChars = data.enhanced.length;
    
    return {
      wordIncrease: ((enhancedWords - originalWords) / originalWords * 100).toFixed(1),
      charIncrease: ((enhancedChars - originalChars) / originalChars * 100).toFixed(1),
      originalWords,
      enhancedWords,
      originalChars,
      enhancedChars,
      readabilityScore: Math.min(100, Math.max(0, 100 - (enhancedWords / 10))).toFixed(0)
    };
  };

  const stats = getStats();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="fixed inset-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Comparação de Prompts</h2>
                <p className="text-blue-100">Veja as melhorias aplicadas ao seu prompt</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 h-full overflow-y-auto">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Palavras</span>
                </div>
                <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                  +{stats.wordIncrease}%
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  {stats.originalWords} → {stats.enhancedWords}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Caracteres</span>
                </div>
                <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  +{stats.charIncrease}%
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  {stats.originalChars} → {stats.enhancedChars}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Qualidade</span>
                </div>
                <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                  {stats.readabilityScore}%
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400">
                  Score de legibilidade
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-700">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Tipo</span>
                </div>
                <div className="text-lg font-bold text-orange-800 dark:text-orange-200 capitalize">
                  {data.enhancementType}
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400">
                  Estilo aplicado
                </div>
              </div>
            </div>

            {/* Side by Side Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    Prompt Original
                  </h3>
                  <button
                    onClick={() => handleCopy(data.original, 'original')}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {copiedSide === 'original' ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {data.original}
                  </p>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <div>📝 {stats.originalWords} palavras</div>
                  <div>🔤 {stats.originalChars} caracteres</div>
                  <div>⚡ ~{Math.ceil(stats.originalChars / 4)} tokens</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex items-center justify-center">
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                >
                  <ArrowRight className="h-6 w-6 text-white" />
                </motion.div>
              </div>

              {/* Enhanced */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    Prompt Aprimorado
                  </h3>
                  <button
                    onClick={() => handleCopy(data.enhanced, 'enhanced')}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 rounded-lg transition-colors"
                  >
                    {copiedSide === 'enhanced' ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {data.enhanced}
                  </p>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <div>📝 {stats.enhancedWords} palavras</div>
                  <div>🔤 {stats.enhancedChars} caracteres</div>
                  <div>⚡ ~{Math.ceil(stats.enhancedChars / 4)} tokens</div>
                </div>
              </div>
            </div>

            {/* Improvements Highlights */}
            <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Melhorias Aplicadas
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Estrutura mais clara e organizada
                  </div>
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Contexto adicional fornecido
                  </div>
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Instruções mais específicas
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Linguagem otimizada para IA
                  </div>
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Formato de resposta definido
                  </div>
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Critérios de qualidade incluídos
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};