import React from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

interface LiveAnalyticsGlobalImpactProps {
  totalPrompts: number;
  totalAccesses: number;
  engagementScore: number;
  formatNumber: (num: number) => string;
}

export const LiveAnalyticsGlobalImpact: React.FC<LiveAnalyticsGlobalImpactProps> = ({
  totalPrompts,
  totalAccesses,
  engagementScore,
  formatNumber,
}) => {
  return (
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
              {formatNumber(totalPrompts)}
            </div>
            <div className="text-yellow-100 text-sm">
              Prompts Aprimorados
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold mb-2">
              {formatNumber(totalAccesses)}
            </div>
            <div className="text-yellow-100 text-sm">
              Vidas Impactadas
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold mb-2">
              {engagementScore.toFixed(0)}%
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
  );
};
