import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wand2, 
  Moon, 
  Sun, 
  History, 
  Sparkles,
  BookOpen,
  BarChart3,
  Download,
  Settings,
  ChevronDown,
  Activity,
  TrendingUp
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface AdvancedHeaderProps {
  onHistoryToggle: () => void;
  onSurpriseMe: () => void;
  onTemplatesOpen: () => void;
  onAnalyticsOpen: () => void;
  onExportOpen: () => void;
  onComparisonOpen: () => void;
  onLiveAnalyticsOpen?: () => void;
  isHistoryOpen: boolean;
}

export const AdvancedHeader: React.FC<AdvancedHeaderProps> = ({ 
  onHistoryToggle, 
  onSurpriseMe,
  onTemplatesOpen,
  onAnalyticsOpen,
  onExportOpen,
  onComparisonOpen,
  onLiveAnalyticsOpen,
  isHistoryOpen 
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showToolsMenu, setShowToolsMenu] = useState(false);

  const tools = [
    { 
      id: 'templates', 
      label: 'Modelos', 
      icon: BookOpen, 
      action: onTemplatesOpen,
      description: 'Prompts prontos para usar'
    },
    { 
      id: 'analytics', 
      label: 'Estatísticas', 
      icon: BarChart3, 
      action: onAnalyticsOpen,
      description: 'Análise de uso pessoal'
    },
    { 
      id: 'live-analytics', 
      label: 'Analytics Globais', 
      icon: Activity, 
      action: onLiveAnalyticsOpen || (() => {}),
      description: 'Impacto global em tempo real',
      highlight: true
    },
    { 
      id: 'export', 
      label: 'Exportar', 
      icon: Download, 
      action: onExportOpen,
      description: 'Baixar seus prompts'
    },
    { 
      id: 'comparison', 
      label: 'Comparar', 
      icon: Settings, 
      action: onComparisonOpen,
      description: 'Comparar versões'
    }
  ];

  return (
    <motion.header 
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-700"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Wand2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                PromptCraft
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Motor de Aprimoramento de IA
              </p>
            </div>
          </motion.div>

          {/* Tools Menu */}
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Live Analytics Button */}
            {onLiveAnalyticsOpen && (
              <motion.button
                onClick={onLiveAnalyticsOpen}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Activity className="h-4 w-4" />
                </motion.div>
                <span className="text-sm font-medium">Analytics</span>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                />
              </motion.button>
            )}

            {/* Tools Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setShowToolsMenu(!showToolsMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Ferramentas</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${showToolsMenu ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {showToolsMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    {tools.map((tool, index) => {
                      const Icon = tool.icon;
                      return (
                        <motion.button
                          key={tool.id}
                          onClick={() => {
                            tool.action();
                            setShowToolsMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${
                            tool.highlight ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20' : ''
                          }`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className={`p-2 rounded-lg ${
                            tool.highlight 
                              ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                              : 'bg-gradient-to-br from-purple-500 to-pink-500'
                          }`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium ${
                              tool.highlight ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                            }`}>
                              {tool.label}
                              {tool.highlight && (
                                <motion.span
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full"
                                >
                                  LIVE
                                </motion.span>
                              )}
                            </div>
                            <div className={`text-sm ${
                              tool.highlight ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {tool.description}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Actions */}
            <motion.button
              onClick={onSurpriseMe}
              className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Me Surpreenda (Ctrl+Shift+R)"
            >
              <Sparkles className="h-4 w-4" />
            </motion.button>

            <motion.button
              onClick={onHistoryToggle}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isHistoryOpen
                  ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Alternar Histórico (Ctrl+Shift+H)"
            >
              <History className="h-4 w-4" />
            </motion.button>

            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Alternar Tema (Ctrl+Shift+T)"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showToolsMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowToolsMenu(false)}
        />
      )}
    </motion.header>
  );
};