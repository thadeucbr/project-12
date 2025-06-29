import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Wand2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  const loadingMessages = [
    "Analisando seu prompt...",
    "Aplicando inteligência artificial...",
    "Otimizando estrutura...",
    "Adicionando contexto...",
    "Finalizando aprimoramento..."
  ];

  const [currentMessage, setCurrentMessage] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loadingMessages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-8">
        {/* Outer ring */}
        <motion.div
          className="w-20 h-20 border-4 border-purple-200 dark:border-purple-800 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner ring */}
        <motion.div
          className="absolute inset-2 w-16 h-16 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-8 w-8 text-purple-600" />
          </motion.div>
        </motion.div>
      </div>

      {/* Loading message */}
      <motion.div
        key={currentMessage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-center"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Aprimorando seu prompt
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
          {loadingMessages[currentMessage]}
        </p>
      </motion.div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 0 }}
        >
          <Zap className="h-6 w-6 text-purple-400" />
        </motion.div>
        
        <motion.div
          className="absolute top-1/3 right-1/4"
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        >
          <Wand2 className="h-6 w-6 text-pink-400" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-1/3 left-1/3"
          animate={{ 
            y: [0, -25, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 2 }}
        >
          <Sparkles className="h-6 w-6 text-indigo-400" />
        </motion.div>
      </div>
    </div>
  );
};