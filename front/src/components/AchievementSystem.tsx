import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Crown, 
  Zap, 
  Target, 
  Award,
  Medal,
  Gem,
  X,
  Lock
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type { Achievement } from '../types';

interface AchievementSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({
  isOpen,
  onClose
}) => {
  const { state } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [showNotification, setShowNotification] = useState<Achievement | null>(null);

  // All possible achievements
  const allAchievements: Achievement[] = [
    {
      id: 'first-prompt',
      name: 'Primeiro Passo',
      description: 'Criou seu primeiro prompt',
      icon: '🎯',
      rarity: 'common',
      unlockedAt: state.userStats.totalPrompts >= 1 ? new Date().toISOString() : ''
    },
    {
      id: 'prompt-master',
      name: 'Mestre dos Prompts',
      description: 'Criou 10 prompts',
      icon: '🏆',
      rarity: 'rare',
      unlockedAt: state.userStats.totalPrompts >= 10 ? new Date().toISOString() : ''
    },
    {
      id: 'prompt-legend',
      name: 'Lenda dos Prompts',
      description: 'Criou 50 prompts',
      icon: '👑',
      rarity: 'epic',
      unlockedAt: state.userStats.totalPrompts >= 50 ? new Date().toISOString() : ''
    },
    {
      id: 'prompt-god',
      name: 'Deus dos Prompts',
      description: 'Criou 100 prompts',
      icon: '⚡',
      rarity: 'legendary',
      unlockedAt: state.userStats.totalPrompts >= 100 ? new Date().toISOString() : ''
    },
    {
      id: 'collector',
      name: 'Colecionador',
      description: 'Criou 5 coleções',
      icon: '📚',
      rarity: 'rare',
      unlockedAt: state.userStats.collectionsCount >= 5 ? new Date().toISOString() : ''
    },
    {
      id: 'favorite-hunter',
      name: 'Caçador de Favoritos',
      description: 'Marcou 20 prompts como favoritos',
      icon: '❤️',
      rarity: 'rare',
      unlockedAt: state.userStats.favoritePrompts >= 20 ? new Date().toISOString() : ''
    },
    {
      id: 'streak-master',
      name: 'Mestre da Sequência',
      description: 'Manteve uma sequência de 7 dias',
      icon: '🔥',
      rarity: 'epic',
      unlockedAt: state.userStats.longestStreak >= 7 ? new Date().toISOString() : ''
    },
    {
      id: 'wordsmith',
      name: 'Mestre das Palavras',
      description: 'Escreveu mais de 10.000 caracteres',
      icon: '✍️',
      rarity: 'rare',
      unlockedAt: state.userStats.totalCharacters >= 10000 ? new Date().toISOString() : ''
    },
    {
      id: 'creative-genius',
      name: 'Gênio Criativo',
      description: 'Criou 10 prompts criativos',
      icon: '🎨',
      rarity: 'epic',
      unlockedAt: state.prompts.filter(p => p.enhancementType === 'creative').length >= 10 ? new Date().toISOString() : ''
    },
    {
      id: 'technical-expert',
      name: 'Especialista Técnico',
      description: 'Criou 10 prompts técnicos',
      icon: '⚙️',
      rarity: 'epic',
      unlockedAt: state.prompts.filter(p => p.enhancementType === 'technical').length >= 10 ? new Date().toISOString() : ''
    },
    {
      id: 'image-artist',
      name: 'Artista Visual',
      description: 'Criou 15 prompts de imagem',
      icon: '🖼️',
      rarity: 'rare',
      unlockedAt: state.prompts.filter(p => p.mediaType === 'image').length >= 15 ? new Date().toISOString() : ''
    },
    {
      id: 'video-director',
      name: 'Diretor de Vídeo',
      description: 'Criou 10 prompts de vídeo',
      icon: '🎬',
      rarity: 'epic',
      unlockedAt: state.prompts.filter(p => p.mediaType === 'video').length >= 10 ? new Date().toISOString() : ''
    }
  ];

  const unlockedAchievements = allAchievements.filter(a => a.unlockedAt);
  const lockedAchievements = allAchievements.filter(a => !a.unlockedAt);

  const filteredAchievements = selectedCategory === 'all' ? allAchievements :
                              selectedCategory === 'unlocked' ? unlockedAchievements :
                              lockedAchievements;

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-cyan-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'legendary': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityIcon = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return Medal;
      case 'rare': return Award;
      case 'epic': return Crown;
      case 'legendary': return Gem;
      default: return Medal;
    }
  };

  const getRarityLabel = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'Comum';
      case 'rare': return 'Raro';
      case 'epic': return 'Épico';
      case 'legendary': return 'Lendário';
      default: return 'Comum';
    }
  };

  // Check for new achievements
  useEffect(() => {
    const newAchievements = allAchievements.filter(achievement => 
      achievement.unlockedAt && 
      !state.achievements.find(a => a.id === achievement.id)
    );

    if (newAchievements.length > 0) {
      setShowNotification(newAchievements[0]);
    }
  }, [state.userStats, state.prompts]);

  if (!isOpen) return null;

  return (
    <>
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
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Conquistas</h2>
                    <p className="text-yellow-100">
                      {unlockedAchievements.length} de {allAchievements.length} desbloqueadas
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Progresso Geral
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.round((unlockedAchievements.length / allAchievements.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(unlockedAchievements.length / allAchievements.length) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 mb-6">
                {[
                  { id: 'all', label: 'Todas', count: allAchievements.length },
                  { id: 'unlocked', label: 'Desbloqueadas', count: unlockedAchievements.length },
                  { id: 'locked', label: 'Bloqueadas', count: lockedAchievements.length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === tab.id
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.label}
                    <span className="px-2 py-1 bg-white dark:bg-gray-700 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredAchievements.map((achievement, index) => {
                  const isUnlocked = !!achievement.unlockedAt;
                  const RarityIcon = getRarityIcon(achievement.rarity);
                  const rarityColor = getRarityColor(achievement.rarity);

                  return (
                    <motion.div
                      key={achievement.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        isUnlocked
                          ? `border-transparent bg-gradient-to-br ${rarityColor} text-white shadow-lg`
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400'
                      }`}
                    >
                      {/* Rarity Badge */}
                      <div className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        isUnlocked
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}>
                        <RarityIcon className="h-3 w-3" />
                        {getRarityLabel(achievement.rarity)}
                      </div>

                      {/* Achievement Icon */}
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-3 ${
                        isUnlocked
                          ? 'bg-white/20'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}>
                        {isUnlocked ? achievement.icon : <Lock className="h-6 w-6" />}
                      </div>

                      {/* Achievement Info */}
                      <h3 className={`font-semibold mb-2 ${
                        isUnlocked ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {achievement.name}
                      </h3>

                      <p className={`text-sm mb-3 ${
                        isUnlocked ? 'text-white/80' : 'text-gray-500 dark:text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>

                      {/* Unlock Date */}
                      {isUnlocked && achievement.unlockedAt && (
                        <div className="text-xs text-white/60">
                          Desbloqueada em {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      )}

                      {/* Progress Indicator for Locked Achievements */}
                      {!isUnlocked && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-1">
                            <div 
                              className="h-1 bg-gray-400 dark:bg-gray-500 rounded-full"
                              style={{ width: '0%' }} // This would be calculated based on progress
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Achievement Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 right-4 z-[60]"
          >
            <div className={`bg-gradient-to-r ${getRarityColor(showNotification.rarity)} p-4 rounded-xl text-white shadow-2xl max-w-sm`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl">
                  {showNotification.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Conquista Desbloqueada!</h4>
                  <p className="text-sm text-white/80">{showNotification.name}</p>
                </div>
                <button
                  onClick={() => setShowNotification(null)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};