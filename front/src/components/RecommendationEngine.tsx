import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Sparkles, 
  X, 
  ThumbsUp, 
  ThumbsDown,
  RefreshCw,
  Brain,
  Zap
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type { Recommendation } from '../types';

export const RecommendationEngine: React.FC = () => {
  const { state, addRecommendation, dismissRecommendation } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Generate initial recommendations
    generateRecommendations();
  }, [state.prompts]);

  const generateRecommendations = async () => {
    if (state.prompts.length === 0) return;

    setIsGenerating(true);

    // Simulate AI recommendation generation
    await new Promise(resolve => setTimeout(resolve, 1000));

    const recommendations = analyzeAndRecommend();
    recommendations.forEach(rec => addRecommendation(rec));

    setIsGenerating(false);
  };

  const analyzeAndRecommend = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    const recentPrompts = state.prompts.slice(0, 10);
    
    // Analyze patterns
    const typeFrequency = recentPrompts.reduce((acc, prompt) => {
      acc[prompt.enhancementType] = (acc[prompt.enhancementType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsedType = Object.entries(typeFrequency)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    // Similar prompts recommendation
    if (recentPrompts.length > 0) {
      const lastPrompt = recentPrompts[0];
      const similarPrompts = state.prompts.filter(p => 
        p.id !== lastPrompt.id &&
        p.enhancementType === lastPrompt.enhancementType &&
        p.tags.some(tag => lastPrompt.tags.includes(tag))
      );

      if (similarPrompts.length > 0) {
        recommendations.push({
          id: crypto.randomUUID(),
          type: 'similar',
          title: 'Prompts Similares Encontrados',
          description: `Encontramos ${similarPrompts.length} prompts similares que podem te interessar`,
          confidence: 0.8,
          reasons: [
            `Mesmo tipo: ${lastPrompt.enhancementType}`,
            `Tags em comum: ${lastPrompt.tags.slice(0, 2).join(', ')}`
          ]
        });
      }
    }

    // Improvement suggestions
    const lowQualityPrompts = state.prompts.filter(p => 
      p.qualityScore && p.qualityScore < 7
    );

    if (lowQualityPrompts.length > 0) {
      recommendations.push({
        id: crypto.randomUUID(),
        type: 'improvement',
        title: 'Oportunidades de Melhoria',
        description: `${lowQualityPrompts.length} prompts podem ser aprimorados para melhor qualidade`,
        confidence: 0.9,
        reasons: [
          'Score de qualidade baixo',
          'Estrutura pode ser melhorada',
          'Contexto adicional recomendado'
        ]
      });
    }

    // Template suggestions
    if (mostUsedType && typeFrequency[mostUsedType] >= 3) {
      recommendations.push({
        id: crypto.randomUUID(),
        type: 'template',
        title: 'Template Personalizado',
        description: `Crie um template baseado nos seus prompts ${mostUsedType}`,
        prompt: `Template baseado nos seus prompts mais usados do tipo ${mostUsedType}`,
        confidence: 0.7,
        reasons: [
          `Você usa muito o tipo ${mostUsedType}`,
          'Templates aceleram o processo',
          'Mantém consistência'
        ]
      });
    }

    // Trend recommendations
    const trendingTypes = ['image-anime', 'video-cinematic', 'creative'];
    const randomTrend = trendingTypes[Math.floor(Math.random() * trendingTypes.length)];
    
    if (!typeFrequency[randomTrend]) {
      recommendations.push({
        id: crypto.randomUUID(),
        type: 'trend',
        title: 'Tendência em Alta',
        description: `Prompts do tipo ${randomTrend} estão em alta na comunidade`,
        confidence: 0.6,
        reasons: [
          'Tendência da comunidade',
          'Novos recursos disponíveis',
          'Resultados impressionantes'
        ]
      });
    }

    return recommendations.slice(0, 3); // Limit to 3 recommendations
  };

  const getRecommendationIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'similar': return Target;
      case 'improvement': return TrendingUp;
      case 'template': return Lightbulb;
      case 'trend': return Sparkles;
      default: return Brain;
    }
  };

  const getRecommendationColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'similar': return 'from-blue-500 to-cyan-500';
      case 'improvement': return 'from-orange-500 to-red-500';
      case 'template': return 'from-purple-500 to-pink-500';
      case 'trend': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (state.recommendations.length === 0 && !isGenerating) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Recomendações Inteligentes
          </h3>
        </div>
        <button
          onClick={generateRecommendations}
          disabled={isGenerating}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-700"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="h-5 w-5 text-indigo-600" />
            </motion.div>
            <span className="text-sm text-indigo-700 dark:text-indigo-300">
              Analisando seus prompts e gerando recomendações...
            </span>
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      <AnimatePresence>
        {state.recommendations.map((recommendation, index) => {
          const Icon = getRecommendationIcon(recommendation.type);
          const colorClass = getRecommendationColor(recommendation.type);

          return (
            <motion.div
              key={recommendation.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClass}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {recommendation.title}
                    </h4>
                    <div className="flex items-center gap-1 ml-2">
                      <div className={`w-2 h-2 rounded-full ${
                        recommendation.confidence >= 0.8 ? 'bg-green-500' :
                        recommendation.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-orange-500'
                      }`} />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round(recommendation.confidence * 100)}%
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {recommendation.description}
                  </p>

                  {recommendation.prompt && (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-3">
                      <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                        {recommendation.prompt}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {recommendation.reasons.slice(0, 2).map((reason, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          // Handle positive feedback
                          dismissRecommendation(recommendation.id);
                        }}
                        className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded text-green-600 dark:text-green-400 transition-colors"
                        title="Útil"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => {
                          // Handle negative feedback
                          dismissRecommendation(recommendation.id);
                        }}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600 dark:text-red-400 transition-colors"
                        title="Não útil"
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => dismissRecommendation(recommendation.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 transition-colors"
                        title="Dispensar"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};