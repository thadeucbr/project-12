import React from 'react';
import { motion } from 'framer-motion';

interface LiveAnalyticsMetricCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
  gradient: string;
  delay: number;
  growth?: string;
  trendIcon?: React.ElementType;
}

export const LiveAnalyticsMetricCard: React.FC<LiveAnalyticsMetricCardProps> = ({
  icon: Icon,
  title,
  value,
  description,
  gradient,
  delay,
  growth,
  trendIcon: TrendIcon,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`${gradient} p-4 sm:p-6 rounded-xl text-white shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
        {growth && (
          <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
            {growth}
          </div>
        )}
        {TrendIcon && !growth && (
          <TrendIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
        )}
      </div>
      <div className="text-2xl sm:text-3xl font-bold mb-2">
        {value}
      </div>
      <div className="text-blue-100 text-sm">
        {description}
      </div>
    </motion.div>
  );
};
