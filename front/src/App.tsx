import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { EnhancedPrompt } from './components/EnhancedPrompt';
import { HistoryPanel } from './components/HistoryPanel';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ThemeProvider } from './contexts/ThemeContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { usePromptEnhancement } from './hooks/usePromptEnhancement';
import { getRandomPrompt } from './utils/randomPrompts';
import type { Prompt } from './types';

function AppContent() {
  const [prompts, setPrompts] = useLocalStorage<Prompt[]>('prompt-history', []);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [currentEnhancementType, setCurrentEnhancementType] = useState<Prompt['enhancementType']>('detailed');
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Hook personalizado para aprimoramento de prompts
  const { enhancePrompt, isLoading, error, clearError } = usePromptEnhancement(
    (enhanced) => {
      setEnhancedPrompt(enhanced);
      setShowEnhanced(true);
    },
    (newPrompt) => {
      setPrompts(prev => [newPrompt, ...prev]);
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
    const categories: ('text' | 'image' | 'video')[] = ['text', 'image', 'video'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Seleciona um prompt aleatório da categoria
    const randomPrompt = getRandomPrompt(randomCategory);
    
    // Seleciona um tipo de enhancement apropriado para a categoria
    const typesByCategory = {
      text: ['detailed', 'creative', 'technical', 'concise'] as const,
      image: ['image'] as const,
      video: ['video'] as const
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
  };

  const handlePromptDelete = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  };

  const handleClearHistory = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico?')) {
      setPrompts([]);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 transition-colors duration-500">
      <Header
        onHistoryToggle={() => setIsHistoryOpen(!isHistoryOpen)}
        onSurpriseMe={handleSurpriseMe}
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
            Converta prompts simples em instruções poderosas para IA - texto, imagem e vídeo
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

        {/* Keyboard Shortcuts Help */}
        <motion.div
          className="fixed bottom-4 left-4 text-xs text-gray-500 dark:text-gray-400 space-y-1 opacity-50 hover:opacity-100 transition-opacity duration-200"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.5, x: 0 }}
          transition={{ delay: 2 }}
        >
          <p>⌘+S Copiar • ⌘+K Limpar • ⌘+⇧+H Histórico</p>
          <p>⌘+⇧+T Tema • ⌘+⇧+R Surpresa</p>
        </motion.div>
      </main>

      <HistoryPanel
        prompts={prompts}
        onPromptSelect={handlePromptSelect}
        onPromptDelete={handlePromptDelete}
        onClearHistory={handleClearHistory}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;