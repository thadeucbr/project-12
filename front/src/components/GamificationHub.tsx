import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Calendar,
  Crown,
  Gift,
  Gamepad2,
  Users,
  TrendingUp,
  Award,
  Flame,
  Clock,
  ChevronRight,
  Play,
  Lock,
  CheckCircle,
  X,
  Coins,
  ShoppingBag,
  Sword,
  Shield,
  Heart,
  Diamond,
  Sparkles,
  Medal,
  Gem
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type { DailyChallenge, WeeklyQuest, PowerUp, MiniGame, SeasonalEvent } from '../types';

interface GamificationHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GamificationHub: React.FC<GamificationHubProps> = ({
  isOpen,
  onClose
}) => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'quests' | 'powerups' | 'minigames' | 'leaderboard' | 'shop' | 'events' | 'achievements'>('overview');
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [coins, setCoins] = useState(1250); // Moedas do jogador
  const [gems, setGems] = useState(45); // Gemas premium

  // Mock data - em uma aplicação real, isso viria do contexto/API
  const dailyChallenges: DailyChallenge[] = [
    {
      id: '1',
      title: 'Criador Matinal',
      description: 'Crie 3 prompts antes das 12h',
      type: 'create_prompts',
      target: 3,
      progress: 1,
      xpReward: 150,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isCompleted: false,
      difficulty: 'easy'
    },
    {
      id: '2',
      title: 'Mestre da Criatividade',
      description: 'Use o tipo "criativo" 5 vezes',
      type: 'use_type',
      target: 5,
      progress: 2,
      xpReward: 200,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isCompleted: false,
      difficulty: 'medium'
    },
    {
      id: '3',
      title: 'Perfeccionista',
      description: 'Alcance qualidade 9+ em um prompt',
      type: 'reach_quality',
      target: 1,
      progress: 0,
      xpReward: 300,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isCompleted: false,
      difficulty: 'hard'
    }
  ];

  const weeklyQuests: WeeklyQuest[] = [
    {
      id: '1',
      title: 'Explorador de Mídias',
      description: 'Domine diferentes tipos de mídia',
      objectives: [
        { id: '1', description: 'Crie 5 prompts de imagem', type: 'image', target: 5, progress: 2, isCompleted: false },
        { id: '2', description: 'Crie 3 prompts de vídeo', type: 'video', target: 3, progress: 0, isCompleted: false },
        { id: '3', description: 'Use edição com IA 2 vezes', type: 'editing', target: 2, progress: 1, isCompleted: false }
      ],
      xpReward: 1000,
      specialReward: 'Título: Explorador Multimídia',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isCompleted: false,
      difficulty: 'normal'
    }
  ];

  const powerUps: PowerUp[] = [
    {
      id: '1',
      name: 'Impulso de XP',
      description: 'Dobra o XP ganho por 30 minutos',
      icon: '⚡',
      type: 'xp_boost',
      duration: 30,
      multiplier: 2,
      cost: 100,
      isActive: false
    },
    {
      id: '2',
      name: 'Proteção de Sequência',
      description: 'Protege sua sequência por 1 dia',
      icon: '🛡️',
      type: 'streak_protection',
      duration: 1440,
      multiplier: 1,
      cost: 200,
      isActive: false
    },
    {
      id: '3',
      name: 'Inspiração Criativa',
      description: 'Aumenta qualidade dos prompts por 1 hora',
      icon: '💡',
      type: 'quality_boost',
      duration: 60,
      multiplier: 1.5,
      cost: 150,
      isActive: false
    }
  ];

  const miniGames: MiniGame[] = [
    {
      id: '1',
      name: 'Construtor de Prompts',
      description: 'Monte prompts usando palavras-chave',
      type: 'prompt_builder',
      difficulty: 'easy',
      xpReward: 50,
      playCount: 0,
      bestScore: 0,
      isUnlocked: true
    },
    {
      id: '2',
      name: 'Teste de Criatividade',
      description: 'Desafie sua criatividade com cenários únicos',
      type: 'creativity_test',
      difficulty: 'medium',
      xpReward: 100,
      playCount: 0,
      bestScore: 0,
      isUnlocked: state.userStats.level >= 5
    },
    {
      id: '3',
      name: 'Digitação Relâmpago',
      description: 'Digite prompts o mais rápido possível',
      type: 'speed_typing',
      difficulty: 'hard',
      xpReward: 150,
      playCount: 0,
      bestScore: 0,
      isUnlocked: state.userStats.level >= 10
    }
  ];

  const shopItems = [
    {
      id: 'theme-neon',
      name: 'Tema Neon',
      description: 'Tema cyberpunk com cores vibrantes',
      price: 500,
      currency: 'coins',
      type: 'theme',
      icon: '🌈',
      rarity: 'rare'
    },
    {
      id: 'avatar-wizard',
      name: 'Avatar Mago',
      description: 'Avatar exclusivo de mago místico',
      price: 10,
      currency: 'gems',
      type: 'avatar',
      icon: '🧙‍♂️',
      rarity: 'epic'
    },
    {
      id: 'title-master',
      name: 'Título: Mestre dos Prompts',
      description: 'Título exclusivo para exibir',
      price: 1000,
      currency: 'coins',
      type: 'title',
      icon: '👑',
      rarity: 'legendary'
    },
    {
      id: 'boost-mega',
      name: 'Mega Boost XP',
      description: 'Triplica XP por 1 hora',
      price: 25,
      currency: 'gems',
      type: 'powerup',
      icon: '🚀',
      rarity: 'epic'
    }
  ];

  const seasonalEvent: SeasonalEvent = {
    id: 'winter-2024',
    name: 'Festival de Inverno',
    description: 'Evento especial com recompensas exclusivas',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    theme: 'winter',
    specialChallenges: [],
    exclusiveRewards: [],
    isActive: true
  };

  const calculateLevelProgress = () => {
    const currentLevelXP = state.userStats.experience;
    const nextLevelXP = state.userStats.nextLevelXP || (state.userStats.level * 1000);
    const prevLevelXP = Math.max(0, (state.userStats.level - 1) * 1000);
    const progress = ((currentLevelXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'extreme': return 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-cyan-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'legendary': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

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
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Gamepad2 className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Centro de Gamificação</h2>
                  <p className="text-purple-100">Desafios, conquistas e diversão!</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Currency Display */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                    <Coins className="h-4 w-4 text-yellow-300" />
                    <span className="font-bold">{coins.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                    <Diamond className="h-4 w-4 text-cyan-300" />
                    <span className="font-bold">{gems}</span>
                  </div>
                </div>
                
                {/* Level & XP Display */}
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="h-4 w-4" />
                    <span className="font-bold">Nível {state.userStats.level}</span>
                  </div>
                  <div className="w-32 bg-white/20 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${calculateLevelProgress()}%` }}
                      className="h-2 bg-white rounded-full"
                    />
                  </div>
                  <div className="text-xs text-purple-100 mt-1">
                    {state.userStats.experience} / {state.userStats.nextLevelXP || (state.userStats.level * 1000)} XP
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex h-full">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
                  { id: 'challenges', label: 'Desafios Diários', icon: Target },
                  { id: 'quests', label: 'Missões Semanais', icon: Calendar },
                  { id: 'achievements', label: 'Conquistas', icon: Trophy },
                  { id: 'powerups', label: 'Power-ups', icon: Zap },
                  { id: 'minigames', label: 'Mini-jogos', icon: Gamepad2 },
                  { id: 'shop', label: 'Loja', icon: ShoppingBag },
                  { id: 'events', label: 'Eventos', icon: Gift },
                  { id: 'leaderboard', label: 'Ranking', icon: Users }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'overview' && (
                <OverviewTab 
                  userStats={state.userStats}
                  dailyChallenges={dailyChallenges}
                  weeklyQuests={weeklyQuests}
                  coins={coins}
                  gems={gems}
                />
              )}

              {activeTab === 'challenges' && (
                <ChallengesTab challenges={dailyChallenges} />
              )}

              {activeTab === 'quests' && (
                <QuestsTab quests={weeklyQuests} />
              )}

              {activeTab === 'achievements' && (
                <AchievementsTab achievements={state.achievements} />
              )}

              {activeTab === 'powerups' && (
                <PowerUpsTab powerUps={powerUps} coins={coins} gems={gems} />
              )}

              {activeTab === 'minigames' && (
                <MiniGamesTab games={miniGames} />
              )}

              {activeTab === 'shop' && (
                <ShopTab items={shopItems} coins={coins} gems={gems} />
              )}

              {activeTab === 'events' && (
                <EventsTab event={seasonalEvent} />
              )}

              {activeTab === 'leaderboard' && (
                <LeaderboardTab />
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Componentes das abas
const OverviewTab: React.FC<{
  userStats: any;
  dailyChallenges: DailyChallenge[];
  weeklyQuests: WeeklyQuest[];
  coins: number;
  gems: number;
}> = ({ userStats, dailyChallenges, weeklyQuests, coins, gems }) => {
  const completedChallenges = dailyChallenges.filter(c => c.isCompleted).length;
  const totalChallenges = dailyChallenges.length;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Visão Geral</h3>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-xl text-white">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-5 w-5" />
            <span className="font-medium">Sequência</span>
          </div>
          <div className="text-2xl font-bold">{userStats.dailyStreak}</div>
          <div className="text-sm text-blue-100">dias consecutivos</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-xl text-white">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5" />
            <span className="font-medium">XP Total</span>
          </div>
          <div className="text-2xl font-bold">{userStats.totalXP || userStats.experience}</div>
          <div className="text-sm text-green-100">pontos de experiência</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl text-white">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5" />
            <span className="font-medium">Conquistas</span>
          </div>
          <div className="text-2xl font-bold">{userStats.achievements.length}</div>
          <div className="text-sm text-purple-100">desbloqueadas</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-xl text-white">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5" />
            <span className="font-medium">Desafios</span>
          </div>
          <div className="text-2xl font-bold">{completedChallenges}/{totalChallenges}</div>
          <div className="text-sm text-orange-100">hoje</div>
        </div>
      </div>

      {/* Currency Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-6 w-6" />
                <span className="font-medium">Moedas</span>
              </div>
              <div className="text-3xl font-bold">{coins.toLocaleString()}</div>
              <div className="text-sm text-yellow-100">Ganhe completando desafios</div>
            </div>
            <div className="text-6xl opacity-20">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Diamond className="h-6 w-6" />
                <span className="font-medium">Gemas</span>
              </div>
              <div className="text-3xl font-bold">{gems}</div>
              <div className="text-sm text-cyan-100">Moeda premium especial</div>
            </div>
            <div className="text-6xl opacity-20">💎</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Desafios de Hoje
          </h4>
          <div className="space-y-3">
            {dailyChallenges.slice(0, 3).map((challenge) => (
              <div key={challenge.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">{challenge.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {challenge.progress}/{challenge.target}
                  </div>
                </div>
                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Missão da Semana
          </h4>
          {weeklyQuests[0] && (
            <div>
              <div className="font-medium mb-2">{weeklyQuests[0].title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {weeklyQuests[0].description}
              </div>
              <div className="space-y-2">
                {weeklyQuests[0].objectives.map((obj) => (
                  <div key={obj.id} className="flex items-center gap-2">
                    <CheckCircle className={`h-4 w-4 ${obj.isCompleted ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`text-sm ${obj.isCompleted ? 'line-through text-gray-500' : ''}`}>
                      {obj.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChallengesTab: React.FC<{ challenges: DailyChallenge[] }> = ({ challenges }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Desafios Diários</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Renovam em <Clock className="h-4 w-4 inline" /> 12h 34m
        </div>
      </div>

      <div className="grid gap-4">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            layout
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 transition-all ${
              challenge.isCompleted 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {challenge.title}
                  </h4>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    challenge.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                    challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {challenge.description}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                  <Star className="h-4 w-4" />
                  <span className="font-medium">{challenge.xpReward} XP</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Progresso</span>
                  <span>{challenge.progress}/{challenge.target}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                    className={`h-3 rounded-full ${
                      challenge.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  />
                </div>
              </div>
              {challenge.isCompleted && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Completo!</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const QuestsTab: React.FC<{ quests: WeeklyQuest[] }> = ({ quests }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Missões Semanais</h3>

      <div className="space-y-6">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {quest.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {quest.description}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 mb-1">
                  <Star className="h-4 w-4" />
                  <span className="font-medium">{quest.xpReward} XP</span>
                </div>
                {quest.specialReward && (
                  <div className="text-sm text-orange-600 dark:text-orange-400">
                    + {quest.specialReward}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {quest.objectives.map((objective) => (
                <div
                  key={objective.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    objective.isCompleted 
                      ? 'bg-green-50 dark:bg-green-900/20' 
                      : 'bg-gray-50 dark:bg-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`h-5 w-5 ${
                      objective.isCompleted ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <span className={objective.isCompleted ? 'line-through text-gray-500' : ''}>
                      {objective.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {objective.progress}/{objective.target}
                    </span>
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          objective.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(objective.progress / objective.target) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AchievementsTab: React.FC<{ achievements: any[] }> = ({ achievements }) => {
  // Mock achievements for demo
  const allAchievements = [
    { id: '1', name: 'Primeiro Passo', description: 'Criou seu primeiro prompt', icon: '🎯', rarity: 'common', unlocked: true },
    { id: '2', name: 'Mestre dos Prompts', description: 'Criou 10 prompts', icon: '🏆', rarity: 'rare', unlocked: false },
    { id: '3', name: 'Lenda dos Prompts', description: 'Criou 50 prompts', icon: '👑', rarity: 'epic', unlocked: false },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Conquistas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-xl border-2 ${
              achievement.unlocked
                ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{achievement.unlocked ? achievement.icon : '🔒'}</div>
              <h4 className="font-semibold mb-1">{achievement.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
              <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                achievement.rarity === 'common' ? 'bg-gray-100 text-gray-700' :
                achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {achievement.rarity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PowerUpsTab: React.FC<{ powerUps: PowerUp[]; coins: number; gems: number }> = ({ powerUps, coins, gems }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Power-ups</h3>
      <p className="text-gray-600 dark:text-gray-400">
        Use power-ups para acelerar seu progresso e ganhar vantagens temporárias!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {powerUps.map((powerUp) => (
          <div
            key={powerUp.id}
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 transition-all ${
              powerUp.isActive 
                ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{powerUp.icon}</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {powerUp.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {powerUp.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Duração:</span>
                  <span>{powerUp.duration}min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Multiplicador:</span>
                  <span>{powerUp.multiplier}x</span>
                </div>
              </div>

              <button
                disabled={powerUp.isActive}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  powerUp.isActive
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                }`}
              >
                {powerUp.isActive ? 'Ativo' : `Usar (${powerUp.cost} moedas)`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MiniGamesTab: React.FC<{ games: MiniGame[] }> = ({ games }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Mini-jogos</h3>
      <p className="text-gray-600 dark:text-gray-400">
        Divirta-se e ganhe XP extra com nossos mini-jogos!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <div
            key={game.id}
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 ${
              game.isUnlocked ? 'hover:shadow-lg transition-shadow' : 'opacity-60'
            }`}
          >
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mx-auto mb-4">
                {game.isUnlocked ? (
                  <Play className="h-8 w-8 text-white" />
                ) : (
                  <Lock className="h-8 w-8 text-white" />
                )}
              </div>
              
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {game.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {game.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Dificuldade:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    game.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                    game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {game.difficulty}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>XP Recompensa:</span>
                  <span className="text-yellow-600 dark:text-yellow-400">{game.xpReward} XP</span>
                </div>
                {game.bestScore > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Melhor Score:</span>
                    <span>{game.bestScore}</span>
                  </div>
                )}
              </div>

              <button
                disabled={!game.isUnlocked}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  game.isUnlocked
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {game.isUnlocked ? 'Jogar' : 'Bloqueado'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ShopTab: React.FC<{ items: any[]; coins: number; gems: number }> = ({ items, coins, gems }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Loja</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span className="font-bold">{coins.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Diamond className="h-5 w-5 text-cyan-500" />
            <span className="font-bold">{gems}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 transition-all hover:shadow-lg ${
              item.rarity === 'legendary' ? 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20' :
              item.rarity === 'epic' ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20' :
              item.rarity === 'rare' ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20' :
              'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {item.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {item.description}
              </p>

              <div className="flex items-center justify-center gap-2 mb-4">
                {item.currency === 'coins' ? (
                  <Coins className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Diamond className="h-5 w-5 text-cyan-500" />
                )}
                <span className="font-bold text-lg">{item.price}</span>
              </div>

              <button
                disabled={item.currency === 'coins' ? coins < item.price : gems < item.price}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  (item.currency === 'coins' ? coins >= item.price : gems >= item.price)
                    ? `bg-gradient-to-r ${getRarityColor(item.rarity)} text-white hover:opacity-90`
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EventsTab: React.FC<{ event: SeasonalEvent }> = ({ event }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Eventos Especiais</h3>

      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Gift className="h-8 w-8" />
          <div>
            <h4 className="text-2xl font-bold">{event.name}</h4>
            <p className="text-blue-100">{event.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">15</div>
            <div className="text-sm text-blue-100">Dias restantes</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-blue-100">Recompensas exclusivas</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">2x</div>
            <div className="text-sm text-blue-100">XP durante o evento</div>
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="font-semibold">Recompensas Exclusivas:</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['❄️ Avatar Inverno', '🎄 Tema Natalino', '⭐ Título Especial', '🎁 Boost Duplo'].map((reward, index) => (
              <div key={index} className="bg-white/20 rounded-lg p-2 text-center text-sm">
                {reward}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LeaderboardTab: React.FC = () => {
  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, username: 'PromptMaster', level: 25, xp: 15420, title: 'Lenda dos Prompts' },
    { rank: 2, username: 'AIWizard', level: 23, xp: 14100, title: 'Mago da IA' },
    { rank: 3, username: 'CreativeGenius', level: 22, xp: 13800, title: 'Gênio Criativo' },
    { rank: 4, username: 'TechExpert', level: 20, xp: 12500, title: 'Especialista Técnico' },
    { rank: 5, username: 'Você', level: 15, xp: 8750, title: 'Explorador' }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Ranking Global</h3>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <h4 className="font-semibold">Top Criadores desta Semana</h4>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`p-4 flex items-center justify-between ${
                entry.username === 'Você' ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  entry.rank === 1 ? 'bg-yellow-500' :
                  entry.rank === 2 ? 'bg-gray-400' :
                  entry.rank === 3 ? 'bg-orange-600' :
                  'bg-gray-500'
                }`}>
                  {entry.rank}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {entry.username}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {entry.title}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-gray-900 dark:text-white">
                  Nível {entry.level}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {entry.xp.toLocaleString()} XP
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function getRarityColor(rarity: string) {
  switch (rarity) {
    case 'common': return 'from-gray-500 to-gray-600';
    case 'rare': return 'from-blue-500 to-cyan-500';
    case 'epic': return 'from-purple-500 to-pink-500';
    case 'legendary': return 'from-yellow-500 to-orange-500';
    default: return 'from-gray-500 to-gray-600';
  }
}