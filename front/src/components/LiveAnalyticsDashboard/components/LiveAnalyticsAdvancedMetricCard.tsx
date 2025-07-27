import React from 'react';
import { motion } from 'framer-motion';

interface LiveAnalyticsAdvancedMetricCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
  delay: number;
  iconBgGradient: string;
  valueColor: string;
  children?: React.ReactNode;
}

export const LiveAnalyticsAdvancedMetricCard: React.FC<LiveAnalyticsAdvancedMetricCardProps> = ({
  icon: Icon,
  title,
  value,
  description,
  delay,
  iconBgGradient,
  valueColor,
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 ${iconBgGradient} rounded-lg`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
          {title}
        </h3>
      </div>
      <div className={`text-2xl sm:text-3xl font-bold ${valueColor} mb-2`}>
        {value}
      </div>
      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        {description}
      </div>
      {children}
    </motion.div>
  );
};
