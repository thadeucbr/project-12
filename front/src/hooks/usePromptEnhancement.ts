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
        enhancedPrompt = getLocalEnhancement(originalPrompt, enhancementType);
      }

      // Determina o tipo de mídia baseado no enhancement type
      const mediaType: 'text' | 'image' | 'video' | 'editing' = 
        enhancementType.startsWith('image-') ? 'image' :
        enhancementType.startsWith('video-') ? 'video' :
        enhancementType.includes('-editing') ? 'editing' : 'text';

      // Cria o objeto do prompt
      const newPrompt: Prompt = {
        id: crypto.randomUUID(),
        originalPrompt: originalPrompt.trim(),
        enhancedPrompt,
        timestamp: new Date().toISOString(),
        tags: generateTags(originalPrompt, enhancementType),
        characterCount: enhancedPrompt.length,
        enhancementType,
        mediaType
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

    } catch {
      // Em caso de erro total, tenta fallback local
      try {
        const fallbackEnhanced = getLocalEnhancement(originalPrompt, enhancementType);
        
        const mediaType: 'text' | 'image' | 'video' | 'editing' = 
          enhancementType.startsWith('image-') ? 'image' :
          enhancementType.startsWith('video-') ? 'video' :
          enhancementType.includes('-editing') ? 'editing' : 'text';
        
        const fallbackPrompt: Prompt = {
          id: crypto.randomUUID(),
          originalPrompt: originalPrompt.trim(),
          enhancedPrompt: fallbackEnhanced,
          timestamp: new Date().toISOString(),
          tags: generateTags(originalPrompt, enhancementType),
          characterCount: fallbackEnhanced.length,
          enhancementType,
          mediaType
        };

        onSave(fallbackPrompt);
        onSuccess(fallbackEnhanced);
        setError('Erro na conexão. Usando aprimoramento local.');
        
        // Limpa o erro após alguns segundos
        setTimeout(() => setError(null), 5000);
      } catch {
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
    'estratégia|plano|roadmap|objetivo|strategy|plan|goal': ['estratégia', 'planejamento'],
    'imagem|foto|visual|picture|image|photo|visual|arte|art': ['visual', 'arte'],
    'vídeo|filme|animação|video|movie|animation|cinema': ['vídeo', 'cinema'],
    'retrato|portrait|pessoa|person|face|rosto': ['retrato', 'pessoas'],
    'paisagem|landscape|natureza|nature|cenário|scenery': ['paisagem', 'natureza'],
    'produto|product|comercial|commercial|publicidade|advertising': ['produto', 'comercial'],
    'abstrato|abstract|conceitual|conceptual|artístico|artistic': ['abstrato', 'artístico'],
    'realista|realistic|fotográfico|photographic|natural': ['realista', 'fotografia'],
    'anime|manga|japonês|japanese|otaku|kawaii|chibi': ['anime', 'manga', 'japonês'],
    'cinematográfico|cinematic|filme|movie|drama': ['cinematográfico', 'filme'],
    'documentário|documentary|educacional|educational|informativo': ['documentário', 'educacional'],
    'animado|animated|cartoon|animação|motion': ['animado', 'animação'],
    'editar|edição|retocar|ajustar|edit|editing|retouch|adjust': ['edição', 'pós-produção'],
    'photoshop|gimp|lightroom|adobe|software': ['photoshop', 'software'],
    'premiere|after effects|davinci|final cut|editor': ['edição-vídeo', 'software'],
    'cor|color|grading|correção|correction': ['cor', 'correção'],
    'efeito|effect|filtro|filter|transição|transition': ['efeitos', 'pós-produção']
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
    concise: 'conciso',
    'image-realistic': 'realista',
    'image-artistic': 'artístico',
    'image-anime': 'anime',
    'image-commercial': 'comercial',
    'video-cinematic': 'cinematográfico',
    'video-documentary': 'documentário',
    'video-animated': 'animado',
    'video-commercial': 'comercial',
    'image-editing': 'edição-imagem',
    'video-editing': 'edição-vídeo'
  };

  if (typeTagMap[enhancementType]) {
    tags.push(typeTagMap[enhancementType]);
  }

  // Adiciona tags específicas para cada tipo de imagem
  if (enhancementType.startsWith('image-')) {
    tags.push('imagem', 'visual');
    if (enhancementType === 'image-realistic') {
      tags.push('fotografia', 'realismo');
    } else if (enhancementType === 'image-artistic') {
      tags.push('arte', 'criativo');
    } else if (enhancementType === 'image-anime') {
      tags.push('anime', 'manga', 'japonês', 'otaku');
    } else if (enhancementType === 'image-commercial') {
      tags.push('marketing', 'produto');
    }
  }

  // Adiciona tags específicas para cada tipo de vídeo
  if (enhancementType.startsWith('video-')) {
    tags.push('vídeo', 'audiovisual');
    if (enhancementType === 'video-cinematic') {
      tags.push('cinema', 'filme');
    } else if (enhancementType === 'video-documentary') {
      tags.push('documentário', 'educacional');
    } else if (enhancementType === 'video-animated') {
      tags.push('animação', 'motion-graphics');
    } else if (enhancementType === 'video-commercial') {
      tags.push('publicidade', 'marketing');
    }
  }

  // Adiciona tags específicas para edição
  if (enhancementType === 'image-editing') {
    tags.push('photoshop', 'retoque', 'pós-produção');
  } else if (enhancementType === 'video-editing') {
    tags.push('premiere', 'after-effects', 'montagem');
  }

  return [...new Set(tags)];
};