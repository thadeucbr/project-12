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
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { LiveAnalyticsDashboard } from './components/LiveAnalyticsDashboard';
import { Footer } from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider, useApp } from './contexts/AppContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { usePromptEnhancement } from './hooks/usePromptEnhancement';
import { useAnalytics } from './hooks/useAnalytics';
import { getRandomPrompt } from './utils/randomPrompts';
import type { Prompt } from './types';

function AppContent() {
  const { state, addPrompt, updatePrompt, toggleFavorite } = useApp();
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [currentEnhancementType, setCurrentEnhancementType] = useState<Prompt['enhancementType']>('detailed');
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isLiveAnalyticsOpen, setIsLiveAnalyticsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [comparisonData, setComparisonData] = useState<any>(null);

  // Analytics hook
  const { trackPromptCreation } = useAnalytics();

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
      
      // Track prompt creation
      trackPromptCreation(newPrompt.originalPrompt, newPrompt.enhancementType);
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
  };

  const handleRetry = () => {
    if (currentPrompt) {
      handlePromptSubmit(currentPrompt, currentEnhancementType);
    }
  };

  useKeyboardShortcuts({
    onSave: () => {
      if (enhancedPrompt) {
        navigator.clipboard.writeText(enhancedPrompt);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 flex flex-col">
      <AdvancedHeader
        onHistoryToggle={() => setIsHistoryOpen(!isHistoryOpen)}
        onSurpriseMe={handleSurpriseMe}
        onTemplatesOpen={() => setIsTemplatesOpen(true)}
        onAnalyticsOpen={() => setIsAnalyticsOpen(true)}
        onLiveAnalyticsOpen={() => setIsLiveAnalyticsOpen(true)}
        onExportOpen={() => setIsExportOpen(true)}
        onComparisonOpen={() => comparisonData && setIsComparisonOpen(true)}
        isHistoryOpen={isHistoryOpen}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
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
          />

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
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingSpinner />
              </motion.div>
            )}
          </AnimatePresence>

          <EnhancedPrompt
            prompt={enhancedPrompt}
            isVisible={showEnhanced && !isLoading}
            onCopy={handleCopy}
            enhancementType={currentEnhancementType}
          />
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <HistoryPanel
        prompts={state.prompts}
        onPromptSelect={handlePromptSelect}
        onPromptDelete={handlePromptDelete}
        onClearHistory={handleClearHistory}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* Live Analytics Dashboard */}
      <LiveAnalyticsDashboard
        isOpen={isLiveAnalyticsOpen}
        onClose={() => setIsLiveAnalyticsOpen(false)}
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