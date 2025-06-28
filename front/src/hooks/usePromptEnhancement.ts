import { useState, useCallback } from 'react';
import { promptEnhancementService, getLocalEnhancement } from '../services/apiService';
import type { Prompt } from '../types';

interface UsePromptEnhancementReturn {
  enhancePrompt: (prompt: string, type: Prompt['enhancementType']) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const usePromptEnhancement = (
  onSuccess: (enhanced: string) => void,
  onSave: (prompt: Prompt) => void
): UsePromptEnhancementReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const enhancePrompt = useCallback(async (
    originalPrompt: string,
    enhancementType: Prompt['enhancementType']
  ) => {
    if (!originalPrompt.trim()) {
      setError('Por favor, digite um prompt para aprimorar');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Tenta usar a API primeiro, passando o tipo de aprimoramento
      const apiResponse = await promptEnhancementService.enhancePrompt(originalPrompt, enhancementType);
      
      let enhancedPrompt: string;
      
      if (apiResponse.success && apiResponse.enhancedPrompt) {
        enhancedPrompt = apiResponse.enhancedPrompt;
      } else {
        // Fallback para lógica local se a API falhar
        console.warn('API falhou, usando aprimoramento local:', apiResponse.error);
        enhancedPrompt = getLocalEnhancement(originalPrompt, enhancementType);
      }

      // Cria o objeto do prompt
      const newPrompt: Prompt = {
        id: crypto.randomUUID(),
        originalPrompt: originalPrompt.trim(),
        enhancedPrompt,
        timestamp: new Date().toISOString(),
        tags: generateTags(originalPrompt, enhancementType),
        characterCount: enhancedPrompt.length,
        enhancementType
      };

      // Salva no localStorage através do callback
      onSave(newPrompt);
      
      // Notifica o sucesso
      onSuccess(enhancedPrompt);

      // Se houve erro na API mas usamos fallback, mostra aviso
      if (!apiResponse.success) {
        setError(`Aviso: ${apiResponse.error}. Usando aprimoramento local.`);
        // Limpa o erro após alguns segundos
        setTimeout(() => setError(null), 5000);
      }

    } catch (err) {
      console.error('Erro no aprimoramento:', err);
      
      // Em caso de erro total, tenta fallback local
      try {
        const fallbackEnhanced = getLocalEnhancement(originalPrompt, enhancementType);
        
        const fallbackPrompt: Prompt = {
          id: crypto.randomUUID(),
          originalPrompt: originalPrompt.trim(),
          enhancedPrompt: fallbackEnhanced,
          timestamp: new Date().toISOString(),
          tags: generateTags(originalPrompt, enhancementType),
          characterCount: fallbackEnhanced.length,
          enhancementType
        };

        onSave(fallbackPrompt);
        onSuccess(fallbackEnhanced);
        setError('Erro na conexão. Usando aprimoramento local.');
        
        // Limpa o erro após alguns segundos
        setTimeout(() => setError(null), 5000);
      } catch (fallbackErr) {
        setError('Erro ao processar o prompt. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onSave]);

  return {
    enhancePrompt,
    isLoading,
    error,
    clearError
  };
};

// Função auxiliar para gerar tags baseadas no prompt e tipo de aprimoramento
const generateTags = (prompt: string, enhancementType: string): string[] => {
  const baseTagMap: Record<string, string[]> = {
    'escrever|escrita|conteúdo|blog|artigo|write|writing|content': ['escrita', 'conteúdo'],
    'código|programação|desenvolver|função|api|code|programming|develop': ['código', 'desenvolvimento'],
    'design|ui|ux|interface|visual': ['design', 'ui-ux'],
    'marketing|publicidade|campanha|marca|advertis|campaign|brand': ['marketing', 'negócios'],
    'dados|análise|gráfico|estatística|data|analysis|chart|statistic': ['dados', 'análise'],
    'email|mensagem|comunicação|carta|message|communication|letter': ['comunicação', 'email'],
    'pesquisa|estudo|investigação|research|study|investigation': ['pesquisa', 'acadêmico'],
    'criativo|história|narrativa|ficção|creative|story|narrative|fiction': ['criativo', 'storytelling'],
    'técnico|especificação|documentação|technical|specification|documentation': ['técnico', 'documentação'],
    'estratégia|plano|roadmap|objetivo|strategy|plan|goal': ['estratégia', 'planejamento']
  };

  const tags: string[] = [];
  const lowerPrompt = prompt.toLowerCase();

  // Adiciona tags baseadas no conteúdo do prompt
  Object.entries(baseTagMap).forEach(([pattern, tagList]) => {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(lowerPrompt)) {
      tags.push(...tagList);
    }
  });

  // Adiciona tag baseada no tipo de aprimoramento
  const typeTagMap: Record<string, string> = {
    detailed: 'detalhado',
    creative: 'criativo',
    technical: 'técnico',
    concise: 'conciso'
  };

  if (typeTagMap[enhancementType]) {
    tags.push(typeTagMap[enhancementType]);
  }

  return [...new Set(tags)];
};