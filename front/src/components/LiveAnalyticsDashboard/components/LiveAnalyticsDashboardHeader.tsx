import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Wifi, WifiOff } from 'lucide-react';

interface LiveAnalyticsDashboardHeaderProps {
  onClose: () => void;
  lastUpdate: Date;
  isConnected: boolean;
}

export const LiveAnalyticsDashboardHeader: React.FC<LiveAnalyticsDashboardHeaderProps> = ({
  onClose,
  lastUpdate,
  isConnected,
}) => {
  return (
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
  );
};
