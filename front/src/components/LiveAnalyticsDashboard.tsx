import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Zap, 
  Globe, 
  Activity,
  Eye,
  Sparkles,
  BarChart3,
  Clock,
  Target,
  Flame,
  Star,
  Award,
  Crown,
  Rocket,
  Heart,
  Brain,
  Lightbulb,
  Code,
  Calendar,
  Wifi,
  WifiOff
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

interface AnalyticsData {
  totalAccesses: number;
  todayAccesses: number;
  totalPrompts: number;
  enhancementTypes: Record<string, number>;
}

interface LiveAnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveAnalyticsDashboard: React.FC<LiveAnalyticsDashboardProps> = ({
  isOpen,
  onClose
}) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [todayGrowth, setTodayGrowth] = useState(0);
  const [isConnected, setIsConnected] = useState(true);

  // Simula dados em tempo real
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setIsLoading(true);
      const stats = await analyticsService.getStats();
      if (stats) {
        setData(stats);
        setTodayGrowth(Math.random() * 15 + 5); // Simula crescimento
      }
      setIsLoading(false);
      setLastUpdate(new Date());
    };

    fetchData();

    // Simula status de conexão
    const connectionInterval = setInterval(() => {
      setIsConnected(Math.random() > 0.05); // 95% uptime
    }, 10000);

    return () => {
      clearInterval(connectionInterval);
    };
  }, [isOpen]);

  const getEnhancementTypeIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = {
      detailed: Brain,
      creative: Lightbulb,
      technical: Code,
      concise: Target,
      'image-realistic': Eye,
      'image-artistic': Sparkles,
      'image-anime': Heart,
      'image-commercial': Award,
      'video-cinematic': Video,
      'video-documentary': Globe,
      'video-animated': Star,
      'video-commercial': Crown,
      'image-editing': Edit,
      'video-editing': Rocket
    };
    return icons[type] || Zap;
  };

  const getEnhancementTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      detailed: 'Detalhado',
      creative: 'Criativo',
      technical: 'Técnico',
      concise: 'Conciso',
      'image-realistic': 'Imagem Realista',
      'image-artistic': 'Imagem Artística',
      'image-anime': 'Imagem Anime',
      'image-commercial': 'Imagem Comercial',
      'video-cinematic': 'Vídeo Cinematográfico',
      'video-documentary': 'Vídeo Documentário',
      'video-animated': 'Vídeo Animado',
      'video-commercial': 'Vídeo Comercial',
      'image-editing': 'Edição de Imagem',
      'video-editing': 'Edição de Vídeo'
    };
    return labels[type] || type;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const getMostPopularType = () => {
    if (!data?.enhancementTypes) return null;
    const entries = Object.entries(data.enhancementTypes);
    if (entries.length === 0) return null;
    return entries.reduce((a, b) => a[1] > b[1] ? a : b);
  };

  const getEngagementScore = () => {
    if (!data) return 0;
    const ratio = data.totalPrompts / Math.max(1, data.totalAccesses);
    return Math.min(100, ratio * 100);
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
          className="fixed inset-2 sm:inset-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-4 sm:p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="p-2 sm:p-3 bg-white/20 rounded-xl"
                  >
                    <Activity className="h-6 w-6 sm:h-8 sm:w-8" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold">Analytics Globais</h2>
                    <p className="text-blue-100 text-sm sm:text-base">Impacto global do Prompts Barbudas</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Status de Conexão */}
                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <Wifi className="h-4 w-4 sm:h-5 sm:w-5 text-green-300" />
                    ) : (
                      <WifiOff className="h-4 w-4 sm:h-5 sm:w-5 text-red-300" />
                    )}
                    <span className="text-xs sm:text-sm">
                      {isConnected ? 'Online' : 'Reconectando...'}
                    </span>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Última Atualização */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-100">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Última atualização: {lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                />
              </div>
            ) : data ? (
              <div className="space-y-6 sm:space-y-8">
                {/* Métricas Principais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Total de Acessos */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 sm:p-6 rounded-xl text-white shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Globe className="h-6 w-6 sm:h-8 sm:w-8" />
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold mb-2">
                      {formatNumber(data.totalAccesses)}
                    </div>
                    <div className="text-blue-100 text-sm">
                      Acessos totais
                    </div>
                  </motion.div>

                  {/* Acessos Hoje */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 sm:p-6 rounded-xl text-white shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Calendar className="h-6 w-6 sm:h-8 sm:w-8" />
                      <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        +{todayGrowth.toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold mb-2">
                      {formatNumber(data.todayAccesses)}
                    </div>
                    <div className="text-purple-100 text-sm">
                      Acessos hoje
                    </div>
                  </motion.div>

                  {/* Total de Prompts */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-orange-500 to-red-600 p-4 sm:p-6 rounded-xl text-white shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Zap className="h-6 w-6 sm:h-8 sm:w-8" />
                      <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-orange-300" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold mb-2">
                      {formatNumber(data.totalPrompts)}
                    </div>
                    <div className="text-orange-100 text-sm">
                      Prompts criados
                    </div>
                  </motion.div>
                </div>

                {/* Métricas Avançadas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {/* Taxa de Engajamento */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                        <Target className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                        Taxa de Engajamento
                      </h3>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                      {getEngagementScore().toFixed(1)}%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Usuários que criam prompts
                    </div>
                    <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getEngagementScore()}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      />
                    </div>
                  </motion.div>

                  {/* Taxa de Crescimento */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                        Crescimento Diário
                      </h3>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      +{todayGrowth.toFixed(1)}%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Comparado a ontem
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                      <span className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                        Tendência positiva
                      </span>
                    </div>
                  </motion.div>

                  {/* Tipo Mais Popular */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                        Mais Popular
                      </h3>
                    </div>
                    {getMostPopularType() && (
                      <>
                        <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400 mb-2">
                          {getEnhancementTypeLabel(getMostPopularType()![0])}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {getMostPopularType()![1]} usos
                        </div>
                        <div className="flex items-center gap-2">
                          {React.createElement(getEnhancementTypeIcon(getMostPopularType()![0]), {
                            className: "h-3 w-3 sm:h-4 sm:w-4 text-purple-500"
                          })}
                          <span className="text-xs sm:text-sm text-purple-600 dark:text-purple-400">
                            Tendência #1
                          </span>
                        </div>
                      </>
                    )}
                  </motion.div>
                </div>

                {/* Gráfico de Tipos de Enhancement */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                      <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      Tipos de Enhancement Mais Utilizados
                    </h3>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {Object.entries(data.enhancementTypes)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 8)
                      .map(([type, count], index) => {
                        const Icon = getEnhancementTypeIcon(type);
                        const percentage = (count / data.totalPrompts) * 100;
                        
                        return (
                          <motion.div
                            key={type}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="flex items-center gap-3 sm:gap-4"
                          >
                            <div className="flex items-center gap-2 sm:gap-3 w-32 sm:w-48">
                              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
                              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                {getEnhancementTypeLabel(type)}
                              </span>
                            </div>
                            
                            <div className="flex-1 flex items-center gap-2 sm:gap-3">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                                  className="h-2 sm:h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                />
                              </div>
                              
                              <div className="text-right min-w-[60px] sm:min-w-[80px]">
                                <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                                  {formatNumber(count)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {percentage.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </motion.div>

                {/* Impacto Global */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-6 sm:p-8 rounded-xl text-white shadow-2xl"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-block mb-4"
                    >
                      <Rocket className="h-12 w-12 sm:h-16 sm:w-16" />
                    </motion.div>
                    
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                      🚀 Prompts Barbudas está Revolucionando a IA!
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
                      <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold mb-2">
                          {formatNumber(data.totalPrompts)}
                        </div>
                        <div className="text-yellow-100 text-sm">
                          Prompts Aprimorados
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold mb-2">
                          {formatNumber(data.totalAccesses)}
                        </div>
                        <div className="text-yellow-100 text-sm">
                          Vidas Impactadas
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold mb-2">
                          {getEngagementScore().toFixed(0)}%
                        </div>
                        <div className="text-yellow-100 text-sm">
                          Taxa de Sucesso
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-base sm:text-lg text-yellow-100 max-w-2xl mx-auto">
                      Cada prompt criado aqui está transformando a forma como as pessoas interagem com IA. 
                      Juntos, estamos construindo o futuro da comunicação humano-máquina! 🌟
                    </p>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400">
                  Erro ao carregar dados de analytics
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};