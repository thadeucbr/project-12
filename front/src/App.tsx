import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvancedHeader } from './components/AdvancedHeader';
import { PromptInput } from './components/PromptInput';
import { EnhancedPrompt } from './components/EnhancedPrompt';
import { HistoryPanel } from './components/HistoryPanel';
import { PromptTemplates } from './components/PromptTemplates';
import { PromptAnalytics } from './components/PromptAnalytics';
import { PromptExport } from './components/PromptExport';
import { PromptComparison } from './components/PromptComparison';
import { FavoritesManager } from './components/FavoritesManager';
import { CollectionsManager } from './components/CollectionsManager';
import { VersionManager } from './components/VersionManager';
import { RecommendationEngine } from './components/RecommendationEngine';
import { AchievementSystem } from './components/AchievementSystem';
import { GamificationHub } from './components/GamificationHub';
import { StreakTracker } from './components/StreakTracker';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useXPNotification } from './components/XPNotification';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider, useApp } from './contexts/AppContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { usePromptEnhancement } from './hooks/usePromptEnhancement';
import { getRandomPrompt } from './utils/randomPrompts';
import type { Prompt } from './types';

function AppContent() {
  const { state, addPrompt, updatePrompt, toggleFavorite } = useApp();
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [currentEnhancementType, setCurrentEnhancementType] = useState<Prompt['enhancementType']>('detailed');
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isVersionManagerOpen, setIsVersionManagerOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isGamificationOpen, setIsGamificationOpen] = useState(false);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [selectedPromptForVersions, setSelectedPromptForVersions] = useState<Prompt | null>(null);

  // XP Notification system
  const { showXPNotification, XPNotificationComponent } = useXPNotification();

  // Hook personalizado para aprimoramento de prompts
  const { enhancePrompt, isLoading, error, clearError } = usePromptEnhancement(
    (enhanced) => {
      setEnhancedPrompt(enhanced);
      setShowEnhanced(true);
      
      // Prepara dados para comparação
      setComparisonData({
        original: currentPrompt,
        enhanced: enhanced,
        enhancementType: currentEnhancementType,
        timestamp: new Date().toISOString()
      });
    },
    (newPrompt) => {
      addPrompt(newPrompt);
      
      // Show XP notification
      const xpGained = 10 + (newPrompt.characterCount > 200 ? 5 : 0);
      const multiplier = state.userStats.comboMultiplier || 1;
      showXPNotification(
        Math.round(xpGained * multiplier),
        'Prompt criado com sucesso!',
        multiplier > 1 ? 'bonus' : 'normal',
        multiplier
      );
    }
  );

  const handlePromptSubmit = async (
    prompt: string, 
    enhancementType: Prompt['enhancementType']
  ) => {
    setCurrentPrompt(prompt);
    setCurrentEnhancementType(enhancementType);
    setShowEnhanced(false);
    clearError();
    
    await enhancePrompt(prompt, enhancementType);
  };

  const handleSurpriseMe = () => {
    // Seleciona uma categoria aleatória
    const categories: ('text' | 'image' | 'video' | 'editing')[] = ['text', 'image', 'video', 'editing'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Seleciona um prompt aleatório da categoria
    const randomPrompt = getRandomPrompt(randomCategory);
    
    // Seleciona um tipo de enhancement apropriado para a categoria
    const typesByCategory = {
      text: ['detailed', 'creative', 'technical', 'concise'] as const,
      image: ['image-realistic', 'image-artistic', 'image-anime', 'image-commercial'] as const,
      video: ['video-cinematic', 'video-documentary', 'video-animated', 'video-commercial'] as const,
      editing: ['image-editing', 'video-editing'] as const
    };
    
    const availableTypes = typesByCategory[randomCategory];
    const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    setCurrentPrompt(randomPrompt);
    setCurrentEnhancementType(randomType);
    
    // Trigger enhancement automatically
    setTimeout(() => {
      handlePromptSubmit(randomPrompt, randomType);
    }, 500);
  };

  const handlePromptSelect = (prompt: Prompt) => {
    setCurrentPrompt(prompt.originalPrompt);
    setEnhancedPrompt(prompt.enhancedPrompt);
    setCurrentEnhancementType(prompt.enhancementType);
    setShowEnhanced(true);
    setIsHistoryOpen(false);
    setIsFavoritesOpen(false);
    setIsCollectionsOpen(false);
    clearError();
    
    // Prepara dados para comparação
    setComparisonData({
      original: prompt.originalPrompt,
      enhanced: prompt.enhancedPrompt,
      enhancementType: prompt.enhancementType,
      timestamp: prompt.timestamp
    });
  };

  const handleTemplateSelect = (template: any) => {
    setCurrentPrompt(template.prompt);
    setCurrentEnhancementType(template.enhancementType);
    setIsTemplatesOpen(false);
  };

  const handlePromptDelete = (id: string) => {
    // This would be handled by the context
  };

  const handleClearHistory = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico?')) {
      // This would be handled by the context
    }
  };

  const handleCopy = () => {
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Show XP notification for copy action
    showXPNotification(5, 'Prompt copiado!', 'normal');
  };

  const handleRetry = () => {
    if (currentPrompt) {
      handlePromptSubmit(currentPrompt, currentEnhancementType);
    }
  };

  const handleVersionSelect = (version: any) => {
    // Handle version selection
    setIsVersionManagerOpen(false);
  };

  const handleCreateVersion = (content: string, changes: string) => {
    // Handle version creation
  };

  const handleInputChange = (value: string) => {
    setCurrentPrompt(value);
    setShowSuggestions(value.trim() === ''); // Esconde sugestões ao digitar
  };

  useKeyboardShortcuts({
    onSave: () => {
      if (enhancedPrompt) {
        navigator.clipboard.writeText(enhancedPrompt);
        showXPNotification(5, 'Prompt salvo!', 'normal');
      }
    },
    onClear: () => {
      setCurrentPrompt('');
      setEnhancedPrompt('');
      setShowEnhanced(false);
      clearError();
    },
    onHistory: () => setIsHistoryOpen(!isHistoryOpen),
    onSurpriseMe: handleSurpriseMe
  });

  useEffect(() => {
    // Restaurar histórico de prompts ao carregar a página
    const savedPrompts = localStorage.getItem('promptHistory');
    if (savedPrompts) {
      state.prompts = JSON.parse(savedPrompts); // Atualiza o estado com os prompts salvos
    }
  }, []);

  useEffect(() => {
    // Salvar histórico de prompts no localStorage sempre que ele mudar
    localStorage.setItem('promptHistory', JSON.stringify(state.prompts));
  }, [state.prompts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      <AdvancedHeader
        onHistoryToggle={() => setIsHistoryOpen(!isHistoryOpen)}
        onSurpriseMe={handleSurpriseMe}
        onTemplatesOpen={() => setIsTemplatesOpen(true)}
        onAnalyticsOpen={() => setIsAnalyticsOpen(true)}
        onExportOpen={() => setIsExportOpen(true)}
        onComparisonOpen={() => comparisonData && setIsComparisonOpen(true)}
        isHistoryOpen={isHistoryOpen}
      />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Transforme Suas Ideias
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Converta prompts simples em instruções poderosas para IA - texto, imagem, vídeo e edição
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-8">
          <PromptInput
            onSubmit={handlePromptSubmit}
            isLoading={isLoading}
            initialValue={currentPrompt}
            onChange={handleInputChange} // Adiciona o evento de mudança
          />

          {/* Lista de sugestões */}
          {showSuggestions && !showEnhanced && !isLoading && (
            <div className="suggestions-container">
              {/* Renderizar sugestões aqui */}
            </div>
          )}

          {/* Mensagem de erro */}
          {error && (
            <ErrorMessage
              message={error}
              onDismiss={clearError}
              onRetry={currentPrompt ? handleRetry : undefined}
              type={error.includes('Aviso') ? 'warning' : 'error'}
            />
          )}

          <AnimatePresence mode="wait">
            {isLoading && !showEnhanced && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LoadingSpinner />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt aprimorado */}
          <EnhancedPrompt
            prompt={enhancedPrompt}
            isVisible={showEnhanced && !isLoading}
            onCopy={handleCopy}
            enhancementType={currentEnhancementType}
          />

          {/* Gamification Components */}
          {/* {state.prompts.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StreakTracker />
              <div className="space-y-4">
                <button
                  onClick={() => setIsGamificationOpen(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">🎮</span>
                    <span className="font-semibold">Centro de Gamificação</span>
                  </div>
                  <div className="text-sm opacity-90 mt-1">
                    Desafios, conquistas e muito mais!
                  </div>
                </button>
                
                <button
                  onClick={() => setIsAchievementsOpen(true)}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">🏆</span>
                    <span className="font-semibold">Conquistas</span>
                  </div>
                  <div className="text-sm opacity-90 mt-1">
                    {state.achievements.length} desbloqueadas
                  </div>
                </button>
              </div>
            </div>
          )} */}

          {/* Recommendation Engine */}
          {/* {recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <RecommendationEngine recommendations={recommendations} />
            </motion.div>
          )} */}
        </div>
      </main>

      {/* XP Notifications */}
      {XPNotificationComponent}

      {/* Modals */}
      <HistoryPanel
        prompts={state.prompts}
        onPromptSelect={handlePromptSelect}
        onPromptDelete={handlePromptDelete}
        onClearHistory={handleClearHistory}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      <FavoritesManager
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        onPromptSelect={handlePromptSelect}
      />

      <CollectionsManager
        isOpen={isCollectionsOpen}
        onClose={() => setIsCollectionsOpen(false)}
        onPromptSelect={handlePromptSelect}
      />

      {selectedPromptForVersions && (
        <VersionManager
          prompt={selectedPromptForVersions}
          isOpen={isVersionManagerOpen}
          onClose={() => {
            setIsVersionManagerOpen(false);
            setSelectedPromptForVersions(null);
          }}
          onVersionSelect={handleVersionSelect}
          onCreateVersion={handleCreateVersion}
        />
      )}

      <AchievementSystem
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
      />

      <GamificationHub
        isOpen={isGamificationOpen}
        onClose={() => setIsGamificationOpen(false)}
      />

      <PromptTemplates
        onSelectTemplate={handleTemplateSelect}
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
      />

      <PromptExport
        prompts={state.prompts}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {comparisonData && (
        <PromptComparison
          data={comparisonData}
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
        />
      )}

      {/* Analytics Modal - Agora apenas acessível via menu de ferramentas */}
      <AnimatePresence>
        {isAnalyticsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsAnalyticsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Painel de Estatísticas</h2>
                    <p className="text-indigo-100">Insights sobre seu uso do PromptCraft</p>
                  </div>
                  <button
                    onClick={() => setIsAnalyticsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6">
                <PromptAnalytics prompts={state.prompts} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;