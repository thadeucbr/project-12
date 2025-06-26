interface ApiResponse {
  enhancedPrompt: string;
  success: boolean;
  error?: string;
}

class ApiError extends Error {
  status?: number;

  constructor({ message, status }: { message: string; status?: number }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

class PromptEnhancementService {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    this.apiKey = import.meta.env.VITE_API_KEY || ''; // Use dynamic key from .env
    this.timeout = 30000; // 30 seconds
  }

  private createPromptTemplate(userPrompt: string): string {
    return `Você é um engenheiro de prompt altamente experiente. Sua função é analisar e reescrever prompts simples criados por usuários, transformando-os em versões completas, claras e eficazes para maximizar o desempenho de um modelo de linguagem (LLM).

Siga rigorosamente as melhores práticas de engenharia de prompt:

1. **Identifique a tarefa principal** desejada pelo usuário e explicite-a com clareza.
2. **Defina o papel (persona)** que o modelo deve assumir (ex: especialista, tutor, consultor, desenvolvedor, etc.).
3. **Inclua o contexto relevante** (se houver) de forma separada e bem delimitada.
4. **Descreva a instrução de forma objetiva**, com passos claros e específicos.
5. **Especifique o formato esperado da resposta**, incluindo estrutura, estilo e nível de detalhamento desejado.
6. **Utilize delimitadores** (ex: \`"""texto"""\`) para separar instruções, contexto e exemplos.
7. **Ajuste o tom da linguagem**, se necessário (ex: formal, amigável, técnico).
8. **Adicione exemplos de entrada/saída (few-shot prompting)** se isso for adequado para tornar o prompt mais robusto.
9. **Evite ambiguidade**, jargões excessivos ou instruções vagas.
10. **Garanta que o prompt final funcione de forma genérica e reutilizável**, sempre que possível.

**Importante:** O prompt deve ser escrito no mesmo idioma do original do usuário. Não traduza. Se o idioma for português, continue em português. Se for inglês, continue em inglês.

---

Aqui está o prompt original digitado pelo usuário:

"""${userPrompt}"""

---

Com base nisso, reescreva um prompt completo, estruturado, eficaz e pronto para uso com LLMs, aplicando todos os itens acima. Apresente apenas o prompt final reescrito. Não inclua explicações.`;
  }

  private async makeRequest(prompt: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/llm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify({
          prompt: this.createPromptTemplate(prompt),
          provider: 'openai',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError({
          message: `Erro na API: ${response.status} - ${response.statusText}`,
          status: response.status,
        });
      }

      const data = await response.json();

      if (!data.output) {
        throw new ApiError({
          message: 'Resposta da API não contém o campo "output"',
        });
      }

      return data.output;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new ApiError({
          message: 'Tempo limite da requisição excedido. Tente novamente.',
        });
      }
      throw error instanceof ApiError ? error : new ApiError({ message: 'Erro inesperado' });
    }
  }

  async enhancePrompt(userPrompt: string): Promise<ApiResponse> {
    if (!userPrompt?.trim()) {
      return {
        success: false,
        error: 'Prompt não pode estar vazio',
        enhancedPrompt: '',
      };
    }

    try {
      const enhancedPrompt = await this.makeRequest(userPrompt.trim());

      return {
        success: true,
        enhancedPrompt: enhancedPrompt.trim(),
      };
    } catch (error) {
      console.error('Erro ao aprimorar prompt:', error);

      return {
        success: false,
        error: error.message || 'Erro desconhecido',
        enhancedPrompt: '',
      };
    }
  }
}

// Singleton instance
export const promptEnhancementService = new PromptEnhancementService();

// Função auxiliar para fallback local (caso a API falhe)
export const getLocalEnhancement = (prompt: string, type: string): string => {
  // Mantém a lógica local existente como fallback
  const enhancementTemplates = {
    detailed: {
      prefix: "Crie uma resposta abrangente e detalhada que",
      modifiers: [
        "inclua exemplos específicos e insights acionáveis",
        "forneça orientação passo a passo quando aplicável",
        "incorpore contexto relevante e informações de background",
        "aborde desafios potenciais e soluções"
      ]
    },
    creative: {
      prefix: "Gere uma resposta inovadora e criativa que",
      modifiers: [
        "explore perspectivas únicas e abordagens não convencionais",
        "incorpore elementos narrativos quando apropriado",
        "use linguagem vívida e envolvente",
        "pense fora da caixa mantendo a relevância"
      ]
    },
    technical: {
      prefix: "Forneça uma resposta precisa e tecnicamente correta que",
      modifiers: [
        "inclua especificações técnicas relevantes e padrões",
        "cite fontes autoritativas e melhores práticas",
        "ofereça detalhes de implementação e exemplos de código",
        "aborde considerações de escalabilidade e performance"
      ]
    },
    concise: {
      prefix: "Entregue uma resposta clara e concisa que",
      modifiers: [
        "foque nas informações mais essenciais",
        "use bullet points ou listas numeradas para clareza",
        "elimine detalhes desnecessários mantendo a completude",
        "forneça valor acionável imediato"
      ]
    }
  };

  const template = enhancementTemplates[type] || enhancementTemplates.detailed;
  const selectedModifiers = template.modifiers
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);

  return `${template.prefix} ${prompt.toLowerCase()}. 

Garanta que sua resposta ${selectedModifiers.join(' e ')}.

Contexto Adicional: ${prompt}`;
};