import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

interface LiveAnalyticsEnhancementChartProps {
  data: Record<string, number>;
  totalPrompts: number;
  getEnhancementTypeIcon: (type: string) => React.ElementType;
  getEnhancementTypeLabel: (type: string) => string;
  formatNumber: (num: number) => string;
}

export const LiveAnalyticsEnhancementChart: React.FC<LiveAnalyticsEnhancementChartProps> = ({
  data,
  totalPrompts,
  getEnhancementTypeIcon,
  getEnhancementTypeLabel,
  formatNumber,
}) => {
  return (
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
        {Object.entries(data)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 8)
          .map(([type, count], index) => {
            const Icon = getEnhancementTypeIcon(type);
            const percentage = (count / totalPrompts) * 100;

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
  );
};
