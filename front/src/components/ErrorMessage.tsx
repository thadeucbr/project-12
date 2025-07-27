import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Wifi, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string | null;
  onDismiss?: () => void;
  onRetry?: () => void;
  type?: 'error' | 'warning' | 'info';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onDismiss,
  onRetry,
  type = 'error'
}) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'info':
        return <Wifi className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-800 dark:text-orange-200';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200';
      default:
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className={`rounded-xl border p-4 shadow-sm ${getStyles()}`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5" data-testid="error-icon">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-relaxed">
              {message}
            </p>
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            {onRetry && (
              <motion.button
                onClick={onRetry}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Tentar novamente"
              >
                <RefreshCw className="h-3 w-3" />
              </motion.button>
            )}
            
            {onDismiss && (
              <motion.button
                onClick={onDismiss}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Fechar"
              >
                <X className="h-3 w-3" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};