import { useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = () => {
  // Função para rastrear acesso à página
  const trackPageView = async () => {
    try {
      // Obtém o IP do usuário (simulado)
      const ip = await getUserIP();
      
      await analyticsService.trackAccess({
        ip: ip,
      });
    } catch (error) {
      console.error('Erro ao rastrear visualização de página:', error);
    }
  };

  // Função para rastrear criação de prompt
  const trackPromptCreation = async (prompt: string, enhancementType: string) => {
    try {
      const ip = await getUserIP();
      
      await analyticsService.trackAccess({
        ip: ip,
        prompt: prompt,
        enhancementType: enhancementType,
      });
    } catch (error) {
      console.error('Erro ao rastrear criação de prompt:', error);
    }
  };

  // Função para obter IP do usuário (simulada)
  const getUserIP = async (): Promise<string> => {
    try {
      // Em produção, você pode usar um serviço como ipapi.co
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      // Fallback para IP simulado
      return `192.168.1.${Math.floor(Math.random() * 255)}`;
    }
  };

  // Rastreia visualização de página automaticamente
  useEffect(() => {
    trackPageView();
  }, []);

  return {
    trackPageView,
    trackPromptCreation,
  };
};