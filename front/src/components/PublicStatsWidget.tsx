import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Eye, 
  BarChart3,
  Globe,
  Sparkles,
  Activity,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

interface PublicStatsData {
  totalAccesses: number;
  todayAccesses: number;
  totalPrompts: number;
  enhancementTypes: Record<string, number>;
}

export const PublicStatsWidget: React.FC = () => {
  const [data, setData] = useState<PublicStatsData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [realtimeCount, setRealtimeCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await analyticsService.getStats();
      if (stats) {
        setData(stats);
      }
      setIsLoading(false);
    };

    fetchStats();

    // Atualiza a cada 60 segundos
    const interval = setInterval(fetchStats, 60000);

    // Simula contador em tempo real
    const realtimeInterval = setInterval(() => {
      setRealtimeCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(realtimeInterval);
    };
  }, []);

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

  const getTypeLabel = (type: string) => {
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

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl shadow-lg"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Activity className="h-5 w-5" />
          </motion.div>
          <span className="text-sm font-medium">Carregando estatísticas...</span>
        </div>
      </motion.div>
    );
  }

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Header Compacto */}
      <motion.div
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-2 bg-white/20 rounded-lg"
            >
              <Globe className="h-5 w-5" />
            </motion.div>
            <div>
              <div className="font-bold text-lg">
                {formatNumber(data.totalPrompts + realtimeCount)} prompts criados
              </div>
              <div className="text-sm text-blue-100">
                {formatNumber(data.totalAccesses)} pessoas impactadas
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-green-400 rounded-full"
            />
            <span className="text-xs">AO VIVO</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </div>
      </motion.div>

      {/* Conteúdo Expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/20"
          >
            <div className="p-4 space-y-4">
              {/* Métricas Rápidas */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {formatNumber(data.todayAccesses)}
                  </div>
                  <div className="text-xs text-blue-100">
                    Hoje
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {((data.totalPrompts / data.totalAccesses) * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-blue-100">
                    Engajamento
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Object.keys(data.enhancementTypes).length}
                  </div>
                  <div className="text-xs text-blue-100">
                    Tipos Ativos
                  </div>
                </div>
              </div>

              {/* Tipo Mais Popular */}
              {getMostPopularType() && (
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-blue-100">Mais Popular</div>
                      <div className="font-semibold">
                        {getTypeLabel(getMostPopularType()![0])}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {formatNumber(getMostPopularType()![1])}
                      </div>
                      <div className="text-xs text-blue-100">usos</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div className="text-center">
                <div className="text-sm text-blue-100 mb-2">
                  Faça parte desta revolução! 🚀
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Crie seu primeiro prompt agora
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};