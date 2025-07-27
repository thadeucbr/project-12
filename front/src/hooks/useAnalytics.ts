import { useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = () => {
  // Função para rastrear acesso à página
  const trackPageView = useCallback(async () => {
    try {
      // Obtém o IP do usuário (simulado)
      const ip = await getUserIP();
      
      await analyticsService.trackAccess({
        ip: ip,
      });
    } catch (_error) {
      console.error('Erro ao rastrear visualização de página:', _error);
    }
  }, []);

  // Função para rastrear criação de prompt
  const trackPromptCreation = useCallback(async (prompt: string, enhancementType: string) => {
    try {
      const ip = await getUserIP();
      
      await analyticsService.trackAccess({
        ip: ip,
        prompt: prompt,
        enhancementType: enhancementType,
      });
    } catch (_error) {
      console.error('Erro ao rastrear criação de prompt:', _error);
    }
  }, []);

  return {
    trackPageView,
    trackPromptCreation,
  };
};