import { LiveAnalyticsDashboardHeader } from './LiveAnalyticsDashboard/components/LiveAnalyticsDashboardHeader';
import { LiveAnalyticsMetricCard } from './LiveAnalyticsDashboard/components/LiveAnalyticsMetricCard';
import { LiveAnalyticsAdvancedMetricCard } from './LiveAnalyticsDashboard/components/LiveAnalyticsAdvancedMetricCard';
import { LiveAnalyticsEnhancementChart } from './LiveAnalyticsDashboard/components/LiveAnalyticsEnhancementChart';
import { LiveAnalyticsGlobalImpact } from './LiveAnalyticsDashboard/components/LiveAnalyticsGlobalImpact';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Zap,
  Globe,
  Eye,
  Sparkles,
  Flame,
  Star,
  Award,
  Crown,
  Rocket,
  Heart,
  Brain,
  Lightbulb,
  Code,
  Video,
  Edit,
  Calendar,
  Target
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
          <LiveAnalyticsDashboardHeader
            onClose={onClose}
            lastUpdate={lastUpdate}
            isConnected={isConnected}
          />

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
                  <LiveAnalyticsMetricCard
                    icon={Globe}
                    title="Total de Acessos"
                    value={formatNumber(data.totalAccesses)}
                    description="Acessos totais"
                    gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
                    delay={0}
                    trendIcon={TrendingUp}
                  />

                  <LiveAnalyticsMetricCard
                    icon={Calendar}
                    title="Acessos Hoje"
                    value={formatNumber(data.todayAccesses)}
                    description="Acessos hoje"
                    gradient="bg-gradient-to-br from-purple-500 to-pink-600"
                    delay={0.1}
                    growth={`+${todayGrowth.toFixed(1)}%`}
                  />

                  <LiveAnalyticsMetricCard
                    icon={Zap}
                    title="Prompts criados"
                    value={formatNumber(data.totalPrompts)}
                    description="Prompts criados"
                    gradient="bg-gradient-to-br from-orange-500 to-red-600"
                    delay={0.2}
                    trendIcon={Flame}
                  />
                </div>

                {/* Métricas Avançadas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  <LiveAnalyticsAdvancedMetricCard
                    icon={Target}
                    title="Taxa de Engajamento"
                    value={`${getEngagementScore().toFixed(1)}%`}
                    description="Usuários que criam prompts"
                    delay={0.3}
                    iconBgGradient="bg-gradient-to-r from-cyan-500 to-blue-500"
                    valueColor="text-cyan-600 dark:text-cyan-400"
                  >
                    <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getEngagementScore()}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      />
                    </div>
                  </LiveAnalyticsAdvancedMetricCard>

                  <LiveAnalyticsAdvancedMetricCard
                    icon={TrendingUp}
                    title="Crescimento Diário"
                    value={`+${todayGrowth.toFixed(1)}%`}
                    description="Comparado a ontem"
                    delay={0.4}
                    iconBgGradient="bg-gradient-to-r from-green-500 to-emerald-500"
                    valueColor="text-green-600 dark:text-green-400"
                  >
                    <div className="mt-4 flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                      <span className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                        Tendência positiva
                      </span>
                    </div>
                  </LiveAnalyticsAdvancedMetricCard>

                  <LiveAnalyticsAdvancedMetricCard
                    icon={Star}
                    title="Mais Popular"
                    value={getMostPopularType() ? getEnhancementTypeLabel(getMostPopularType()![0]) : 'N/A'}
                    description={getMostPopularType() ? `${getMostPopularType()![1]} usos` : 'N/A'}
                    delay={0.5}
                    iconBgGradient="bg-gradient-to-r from-purple-500 to-pink-500"
                    valueColor="text-purple-600 dark:text-purple-400"
                  >
                    {getMostPopularType() && (
                      <div className="flex items-center gap-2">
                        {React.createElement(getEnhancementTypeIcon(getMostPopularType()![0]), {
                          className: "h-3 w-3 sm:h-4 sm:w-4 text-purple-500"
                        })}
                        <span className="text-xs sm:text-sm text-purple-600 dark:text-purple-400">
                          Tendência #1
                        </span>
                      </div>
                    )}
                  </LiveAnalyticsAdvancedMetricCard>
                </div>

                <LiveAnalyticsEnhancementChart
                  data={data.enhancementTypes}
                  totalPrompts={data.totalPrompts}
                  getEnhancementTypeIcon={getEnhancementTypeIcon}
                  getEnhancementTypeLabel={getEnhancementTypeLabel}
                  formatNumber={formatNumber}
                />

                <LiveAnalyticsGlobalImpact
                  totalPrompts={data.totalPrompts}
                  totalAccesses={data.totalAccesses}
                  engagementScore={getEngagementScore()}
                  formatNumber={formatNumber}
                />
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