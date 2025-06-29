import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Zap, 
  Trophy, 
  Crown, 
  Gift, 
  Sparkles,
  TrendingUp,
  Award,
  Target,
  Flame
} from 'lucide-react';

interface XPNotificationProps {
  xpGained: number;
  reason: string;
  type?: 'normal' | 'bonus' | 'achievement' | 'levelup' | 'streak' | 'perfect';
  multiplier?: number;
  isVisible: boolean;
  onComplete?: () => void;
}

export const XPNotification: React.FC<XPNotificationProps> = ({
  xpGained,
  reason,
  type = 'normal',
  multiplier = 1,
  isVisible,
  onComplete
}) => {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowDetails(true);
      const timer = setTimeout(() => {
        setShowDetails(false);
        setTimeout(() => onComplete?.(), 300);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  const getNotificationConfig = () => {
    switch (type) {
      case 'levelup':
        return {
          icon: Crown,
          color: 'from-yellow-500 to-orange-500',
          bgColor: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
          borderColor: 'border-yellow-500',
          title: 'LEVEL UP!',
          subtitle: 'Você subiu de nível!',
          animation: 'bounce'
        };
      case 'achievement':
        return {
          icon: Trophy,
          color: 'from-purple-500 to-pink-500',
          bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
          borderColor: 'border-purple-500',
          title: 'CONQUISTA!',
          subtitle: 'Nova conquista desbloqueada',
          animation: 'pulse'
        };
      case 'streak':
        return {
          icon: Flame,
          color: 'from-orange-500 to-red-500',
          bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
          borderColor: 'border-orange-500',
          title: 'SEQUÊNCIA!',
          subtitle: 'Bonus de sequência ativo',
          animation: 'wiggle'
        };
      case 'perfect':
        return {
          icon: Sparkles,
          color: 'from-cyan-500 to-blue-500',
          bgColor: 'from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20',
          borderColor: 'border-cyan-500',
          title: 'PERFEITO!',
          subtitle: 'Dia perfeito completado',
          animation: 'sparkle'
        };
      case 'bonus':
        return {
          icon: Zap,
          color: 'from-green-500 to-emerald-500',
          bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
          borderColor: 'border-green-500',
          title: 'BONUS XP!',
          subtitle: 'Multiplicador ativo',
          animation: 'flash'
        };
      default:
        return {
          icon: Star,
          color: 'from-blue-500 to-indigo-500',
          bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
          borderColor: 'border-blue-500',
          title: 'XP GANHO!',
          subtitle: reason,
          animation: 'slide'
        };
    }
  };

  const config = getNotificationConfig();
  const Icon = config.icon;

  const getAnimationVariants = () => {
    switch (config.animation) {
      case 'bounce':
        return {
          initial: { scale: 0, y: 50 },
          animate: { 
            scale: 1, 
            y: 0,
            transition: {
              type: "spring",
              damping: 10,
              stiffness: 100
            }
          },
          exit: { scale: 0, opacity: 0 }
        };
      case 'pulse':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { 
            scale: [0.8, 1.1, 1], 
            opacity: 1,
            transition: {
              duration: 0.6,
              times: [0, 0.6, 1]
            }
          },
          exit: { scale: 0.8, opacity: 0 }
        };
      case 'wiggle':
        return {
          initial: { x: -50, opacity: 0 },
          animate: { 
            x: [0, -5, 5, -5, 0], 
            opacity: 1,
            transition: {
              x: { duration: 0.8, times: [0, 0.2, 0.4, 0.6, 1] },
              opacity: { duration: 0.3 }
            }
          },
          exit: { x: 50, opacity: 0 }
        };
      case 'sparkle':
        return {
          initial: { scale: 0, rotate: -180 },
          animate: { 
            scale: 1, 
            rotate: 0,
            transition: {
              type: "spring",
              damping: 15,
              stiffness: 200
            }
          },
          exit: { scale: 0, rotate: 180 }
        };
      case 'flash':
        return {
          initial: { opacity: 0, scale: 1.2 },
          animate: { 
            opacity: [0, 1, 0.8, 1], 
            scale: [1.2, 0.9, 1.05, 1],
            transition: {
              duration: 0.8,
              times: [0, 0.3, 0.6, 1]
            }
          },
          exit: { opacity: 0, scale: 0.8 }
        };
      default:
        return {
          initial: { y: -100, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -100, opacity: 0 }
        };
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {showDetails && (
        <motion.div
          className="fixed top-4 right-4 z-[100]"
          {...getAnimationVariants()}
        >
          <div className={`bg-gradient-to-r ${config.bgColor} border-2 ${config.borderColor} rounded-xl p-4 shadow-2xl backdrop-blur-sm max-w-sm`}>
            <div className="flex items-center gap-3">
              {/* Icon with animation */}
              <motion.div
                animate={
                  config.animation === 'sparkle' ? {
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  } : config.animation === 'pulse' ? {
                    scale: [1, 1.1, 1]
                  } : config.animation === 'flash' ? {
                    opacity: [1, 0.5, 1]
                  } : {}
                }
                transition={{
                  duration: config.animation === 'sparkle' ? 2 : 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`p-3 rounded-xl bg-gradient-to-r ${config.color} shadow-lg`}
              >
                <Icon className="h-6 w-6 text-white" />
              </motion.div>

              <div className="flex-1">
                <div className="font-bold text-gray-900 dark:text-white text-sm">
                  {config.title}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {config.subtitle}
                </div>
                
                {/* XP Display */}
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="flex items-center gap-1"
                  >
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                      +{xpGained}
                    </span>
                    {multiplier > 1 && (
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-1 rounded">
                        {multiplier}x
                      </span>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Progress indicator */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-30"
              />
            </div>

            {/* Floating particles for special types */}
            {(type === 'levelup' || type === 'achievement') && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      opacity: 0, 
                      scale: 0,
                      x: Math.random() * 200 - 100,
                      y: Math.random() * 100 - 50
                    }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0, 1, 0],
                      y: [0, -50],
                      x: [0, (Math.random() - 0.5) * 100]
                    }}
                    transition={{ 
                      duration: 2,
                      delay: i * 0.2,
                      ease: "easeOut"
                    }}
                    className="absolute"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: '50%'
                    }}
                  >
                    <Sparkles className="h-3 w-3 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook para usar notificações XP
export const useXPNotification = () => {
  const [notification, setNotification] = useState<{
    xpGained: number;
    reason: string;
    type?: 'normal' | 'bonus' | 'achievement' | 'levelup' | 'streak' | 'perfect';
    multiplier?: number;
  } | null>(null);

  const showXPNotification = (
    xpGained: number,
    reason: string,
    type?: 'normal' | 'bonus' | 'achievement' | 'levelup' | 'streak' | 'perfect',
    multiplier?: number
  ) => {
    setNotification({ xpGained, reason, type, multiplier });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return {
    notification,
    showXPNotification,
    hideNotification,
    XPNotificationComponent: notification ? (
      <XPNotification
        {...notification}
        isVisible={!!notification}
        onComplete={hideNotification}
      />
    ) : null
  };
};