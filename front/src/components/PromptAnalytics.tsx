import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  Calendar,
  Zap,
  FileText,
  Image,
  Video
} from 'lucide-react';
import type { Prompt } from '../types';

interface PromptAnalyticsProps {
  prompts: Prompt[];
}

export const PromptAnalytics: React.FC<PromptAnalyticsProps> = ({ prompts }) => {
  const analytics = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Contadores básicos
    const totalPrompts = prompts.length;
    const todayPrompts = prompts.filter(p => new Date(p.timestamp) >= today).length;
    const weekPrompts = prompts.filter(p => new Date(p.timestamp) >= thisWeek).length;
    const monthPrompts = prompts.filter(p => new Date(p.timestamp) >= thisMonth).length;

    // Análise por tipo
    const typeStats = prompts.reduce((acc, prompt) => {
      acc[prompt.enhancementType] = (acc[prompt.enhancementType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise por mídia
    const mediaStats = prompts.reduce((acc, prompt) => {
      const mediaType = prompt.mediaType || 'text';
      acc[mediaType] = (acc[mediaType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Estatísticas de caracteres
    const avgCharacters = prompts.length > 0 
      ? Math.round(prompts.reduce((sum, p) => sum + p.characterCount, 0) / prompts.length)
      : 0;

    // Tendência (comparação com período anterior)
    const previousWeek = new Date(thisWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previousWeekPrompts = prompts.filter(p => {
      const date = new Date(p.timestamp);
      return date >= previousWeek && date < thisWeek;
    }).length;

    const weeklyTrend = previousWeekPrompts > 0 
      ? ((weekPrompts - previousWeekPrompts) / previousWeekPrompts * 100)
      : weekPrompts > 0 ? 100 : 0;

    // Horários mais ativos
    const hourlyStats = prompts.reduce((acc, prompt) => {
      const hour = new Date(prompt.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const mostActiveHour = Object.entries(hourlyStats)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '0';

    return {
      totalPrompts,
      todayPrompts,
      weekPrompts,
      monthPrompts,
      typeStats,
      mediaStats,
      avgCharacters,
      weeklyTrend,
      mostActiveHour: parseInt(mostActiveHour),
      hourlyStats
    };
  }, [prompts]);

  const typeIcons = {
    detailed: FileText,
    creative: Zap,
    technical: Target,
    concise: TrendingUp,
    image: Image,
    video: Video
  };

  const typeColors = {
    detailed: 'from-blue-500 to-cyan-500',
    creative: 'from-purple-500 to-pink-500',
    technical: 'from-green-500 to-emerald-500',
    concise: 'from-orange-500 to-red-500',
    image: 'from-pink-500 to-rose-500',
    video: 'from-indigo-500 to-purple-600'
  };

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Total</span>
          </div>
          <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            {analytics.totalPrompts}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            prompts criados
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Hoje</span>
          </div>
          <div className="text-2xl font-bold text-green-800 dark:text-green-200">
            {analytics.todayPrompts}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            prompts hoje
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Tendência</span>
          </div>
          <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
            {analytics.weeklyTrend > 0 ? '+' : ''}{analytics.weeklyTrend.toFixed(0)}%
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400">
            vs. semana anterior
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Horário Ativo</span>
          </div>
          <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
            {formatHour(analytics.mostActiveHour)}
          </div>
          <div className="text-xs text-orange-600 dark:text-orange-400">
            mais produtivo
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhancement Types */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Tipos de Aprimoramento
          </h3>
          
          <div className="space-y-3">
            {Object.entries(analytics.typeStats)
              .sort(([,a], [,b]) => b - a)
              .map(([type, count]) => {
                const Icon = typeIcons[type as keyof typeof typeIcons] || FileText;
                const color = typeColors[type as keyof typeof typeColors] || 'from-gray-500 to-gray-600';
                const percentage = (count / analytics.totalPrompts * 100).toFixed(1);
                
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded bg-gradient-to-r ${color}`}>
                          <Icon className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {count} ({percentage}%)
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className={`h-2 rounded-full bg-gradient-to-r ${color}`}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>

        {/* Media Types */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Tipos de Mídia
          </h3>
          
          <div className="space-y-4">
            {Object.entries(analytics.mediaStats)
              .sort(([,a], [,b]) => b - a)
              .map(([media, count]) => {
                const icons = { text: FileText, image: Image, video: Video };
                const colors = { 
                  text: 'from-blue-500 to-cyan-500',
                  image: 'from-pink-500 to-rose-500',
                  video: 'from-indigo-500 to-purple-600'
                };
                
                const Icon = icons[media as keyof typeof icons] || FileText;
                const color = colors[media as keyof typeof colors] || 'from-gray-500 to-gray-600';
                const percentage = (count / analytics.totalPrompts * 100).toFixed(1);
                
                return (
                  <div key={media} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white capitalize">
                          {media}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {count} prompts
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      </div>

      {/* Additional Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-700"
      >
        <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-4">
          Estatísticas Adicionais
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
              {analytics.avgCharacters}
            </div>
            <div className="text-sm text-indigo-600 dark:text-indigo-400">
              Caracteres médios
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
              {analytics.weekPrompts}
            </div>
            <div className="text-sm text-indigo-600 dark:text-indigo-400">
              Esta semana
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
              {analytics.monthPrompts}
            </div>
            <div className="text-sm text-indigo-600 dark:text-indigo-400">
              Este mês
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
              {Math.ceil(analytics.avgCharacters / 4)}
            </div>
            <div className="text-sm text-indigo-600 dark:text-indigo-400">
              Tokens médios
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};