import { useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = () => {
  // Função para obter IP do usuário (simulada)
  const getUserIP = useCallback(async (): Promise<string> => {
    try {
      // Em produção, você pode usar um serviço como ipapi.co
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (_error) {
      // Fallback para IP simulado
      return `192.168.1.${Math.floor(Math.random() * 255)}`;
    }
  }, []);

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
  }, [getUserIP]);

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
  }, [getUserIP]);

  // Rastreia visualização de página automaticamente
  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  return {
    trackPageView,
    trackPromptCreation,
  };
};