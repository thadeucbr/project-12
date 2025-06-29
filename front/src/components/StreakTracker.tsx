import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Calendar, 
  Target, 
  TrendingUp, 
  Award,
  CheckCircle,
  Clock,
  Zap,
  Star,
  Crown,
  Gift,
  Shield
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const StreakTracker: React.FC = () => {
  const { state } = useApp();
  const [showDetails, setShowDetails] = useState(false);

  // Calcula os dados da sequência
  const currentStreak = state.userStats.dailyStreak;
  const longestStreak = state.userStats.longestStreak;
  const perfectDays = state.userStats.perfectDays || 0;
  const comboMultiplier = state.userStats.comboMultiplier || 1;

  // Gera os últimos 7 dias para visualização
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    
    // Simula se o dia foi completado (baseado na sequência atual)
    const isCompleted = i >= (7 - currentStreak);
    const isToday = i === 6;
    const isPerfect = isCompleted && Math.random() > 0.3; // 70% chance de ser perfeito
    
    return {
      date,
      isCompleted,
      isToday,
      isPerfect,
      dayName: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      dayNumber: date.getDate(),
      xpEarned: isCompleted ? Math.floor(Math.random() * 200) + 100 : 0
    };
  });

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'from-purple-500 to-pink-500';
    if (streak >= 14) return 'from-orange-500 to-red-500';
    if (streak >= 7) return 'from-blue-500 to-cyan-500';
    if (streak >= 3) return 'from-green-500 to-emerald-500';
    return 'from-gray-500 to-gray-600';
  };

  const getStreakTitle = (streak: number) => {
    if (streak >= 30) return 'Lenda Imortal! 🔥';
    if (streak >= 14) return 'Mestre Dedicado! 🏆';
    if (streak >= 7) return 'Guerreiro Consistente! ⚡';
    if (streak >= 3) return 'Em Chamas! 🔥';
    return 'Começando! 💪';
  };

  const getNextMilestone = (streak: number) => {
    if (streak < 3) return { target: 3, reward: 'Título: Iniciante Dedicado', type: 'title' };
    if (streak < 7) return { target: 7, reward: 'Badge: Guerreiro da Semana', type: 'badge' };
    if (streak < 14) return { target: 14, reward: 'Power-up: Proteção de Sequência', type: 'powerup' };
    if (streak < 30) return { target: 30, reward: 'Título Lendário: Imortal', type: 'title' };
    if (streak < 50) return { target: 50, reward: 'Avatar Especial: Fênix', type: 'avatar' };
    if (streak < 100) return { target: 100, reward: 'Tema Exclusivo: Fogo Eterno', type: 'theme' };
    return { target: streak + 10, reward: 'Recompensa Especial', type: 'special' };
  };

  const nextMilestone = getNextMilestone(currentStreak);

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'title': return Crown;
      case 'badge': return Award;
      case 'powerup': return Zap;
      case 'avatar': return Star;
      case 'theme': return Gift;
      default: return Target;
    }
  };

  const RewardIcon = getRewardIcon(nextMilestone.type);

  // Calcula estatísticas da semana
  const weeklyXP = last7Days.reduce((sum, day) => sum + day.xpEarned, 0);
  const perfectDaysThisWeek = last7Days.filter(day => day.isPerfect).length;
  const completedDaysThisWeek = last7Days.filter(day => day.isCompleted).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              scale: currentStreak > 0 ? [1, 1.1, 1] : 1,
              rotate: currentStreak > 0 ? [0, 5, -5, 0] : 0
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`p-3 rounded-xl bg-gradient-to-r ${getStreakColor(currentStreak)} shadow-lg`}
          >
            <Flame className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Sequência de {currentStreak} dias
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getStreakTitle(currentStreak)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Streak Multiplier */}
          <div className="text-center">
            <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
              <Zap className="h-4 w-4" />
              <span className="font-bold">{comboMultiplier.toFixed(1)}x</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Multiplicador
            </div>
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <TrendingUp className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Visualização dos 7 dias */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {last7Days.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {day.dayName}
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                day.isCompleted
                  ? `bg-gradient-to-r ${getStreakColor(currentStreak)} text-white shadow-lg`
                  : day.isToday
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 border-2 border-blue-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {day.isCompleted ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                day.dayNumber
              )}
              
              {/* Perfect Day Indicator */}
              {day.isPerfect && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center"
                >
                  <Star className="h-2 w-2 text-white" />
                </motion.div>
              )}
            </motion.div>
            
            {/* XP Earned */}
            {day.xpEarned > 0 && (
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                +{day.xpEarned}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Progresso para próximo marco */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <RewardIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Próximo marco: {nextMilestone.target} dias
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentStreak}/{nextMilestone.target}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (currentStreak / nextMilestone.target) * 100)}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-3 rounded-full bg-gradient-to-r ${getStreakColor(currentStreak)}`}
          />
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
          <Gift className="h-3 w-3" />
          <span>Recompensa: {nextMilestone.reward}</span>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {longestStreak}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Recorde
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
            {perfectDays}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Dias Perfeitos
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {weeklyXP}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            XP Semanal
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {comboMultiplier.toFixed(1)}x
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Multiplicador
          </div>
        </div>
      </div>

      {/* Detalhes expandidos */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="space-y-4">
              {/* Weekly Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Resumo da Semana
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-blue-700 dark:text-blue-300">
                      {completedDaysThisWeek}/7
                    </div>
                    <div className="text-blue-600 dark:text-blue-400">
                      Dias ativos
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-blue-700 dark:text-blue-300">
                      {perfectDaysThisWeek}
                    </div>
                    <div className="text-blue-600 dark:text-blue-400">
                      Dias perfeitos
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-blue-700 dark:text-blue-300">
                      {weeklyXP}
                    </div>
                    <div className="text-blue-600 dark:text-blue-400">
                      XP total
                    </div>
                  </div>
                </div>
              </div>

              {/* Streak Benefits */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Benefícios da Sequência
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Zap className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-800 dark:text-green-200">
                        +{Math.round((comboMultiplier - 1) * 100)}% XP Bonus
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        Por manter a sequência
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-purple-800 dark:text-purple-200">
                        Proteção Ativa
                      </div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">
                        1 dia de proteção disponível
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Goals */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Metas Diárias
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Criar 3 prompts
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="w-2/3 h-2 bg-green-500 rounded-full" />
                      </div>
                      <span className="text-sm font-medium">2/3</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Ganhar 100 XP
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="w-4/5 h-2 bg-blue-500 rounded-full" />
                      </div>
                      <span className="text-sm font-medium">80/100</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Usar 2 tipos diferentes
                    </span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">Completo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Remaining */}
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Tempo restante hoje
                  </span>
                </div>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  8h 32m
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};