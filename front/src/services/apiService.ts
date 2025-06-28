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
  private privateKey: string;
  private timeout: number;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    this.apiKey = import.meta.env.VITE_API_KEY || '';
    this.privateKey = import.meta.env.VITE_PRIVATE_KEY || '';
    this.timeout = 30000; // 30 seconds
  }

  private createPromptTemplate(userPrompt: string, enhancementType: string): string {
    const baseInstruction = `Você é um engenheiro de prompt altamente experiente. Sua função é analisar e reescrever prompts simples criados por usuários, transformando-os em versões completas, claras e eficazes para maximizar o desempenho de um modelo de linguagem (LLM).`;

    const typeSpecificInstructions = {
      detailed: `
Foque em criar um prompt DETALHADO e ABRANGENTE que:
- Inclua contexto específico e informações de background relevantes
- Forneça instruções passo a passo quando aplicável
- Especifique exemplos concretos e casos de uso
- Defina claramente o formato esperado da resposta
- Inclua critérios de qualidade e métricas de sucesso
- Antecipe possíveis dúvidas e forneça esclarecimentos
- Use estrutura hierárquica com seções bem definidas`,

      creative: `
Foque em criar um prompt CRIATIVO e INOVADOR que:
- Estimule pensamento fora da caixa e abordagens não convencionais
- Incorpore elementos narrativos e storytelling quando apropriado
- Use linguagem vívida e inspiradora
- Encoraje múltiplas perspectivas e soluções alternativas
- Inclua elementos de brainstorming e exploração de ideias
- Promova originalidade mantendo a relevância prática
- Utilize técnicas de pensamento lateral e associação livre`,

      technical: `
Foque em criar um prompt TÉCNICO e PRECISO que:
- Especifique requisitos técnicos detalhados e padrões
- Inclua terminologia técnica apropriada e específica
- Defina parâmetros, limitações e especificações exatas
- Referencie melhores práticas e metodologias estabelecidas
- Solicite documentação técnica e exemplos de código
- Aborde considerações de performance, escalabilidade e segurança
- Estruture a resposta em formato técnico profissional`,

      concise: `
Foque em criar um prompt CONCISO e DIRETO que:
- Elimine informações desnecessárias mantendo a clareza
- Use linguagem objetiva e instruções diretas
- Priorize informações essenciais e acionáveis
- Estruture em bullet points ou listas numeradas
- Defina escopo limitado e específico
- Solicite respostas sucintas e bem organizadas
- Mantenha foco no resultado prático imediato`,

      image: `
Foque em criar um prompt OTIMIZADO PARA GERAÇÃO DE IMAGENS que:
- Inclua descrições visuais detalhadas e específicas
- Especifique estilo artístico, técnica e composição
- Defina iluminação, cores, texturas e atmosfera
- Inclua detalhes sobre perspectiva, enquadramento e foco
- Mencione qualidade técnica (resolução, nitidez, etc.)
- Especifique elementos de design e estética
- Use terminologia específica para IA de imagem (ex: "highly detailed", "8K", "photorealistic")
- Inclua aspectos técnicos como câmera, lente, configurações
- Defina mood, emoção e narrativa visual
- Especifique elementos que devem ser evitados (negative prompts)`,

      video: `
Foque em criar um prompt ESPECIALIZADO PARA GERAÇÃO DE VÍDEOS que:
- Descreva movimento, ação e sequência temporal
- Especifique duração, ritmo e transições
- Inclua detalhes sobre cinematografia e direção
- Defina ângulos de câmera, movimentos e enquadramentos
- Especifique iluminação dinâmica e mudanças visuais
- Inclua elementos de narrativa e storytelling temporal
- Defina qualidade técnica (fps, resolução, estabilização)
- Especifique estilo visual e tratamento de cor
- Inclua detalhes sobre áudio e sincronização
- Defina início, meio e fim da sequência
- Especifique elementos de continuidade e fluidez`
    };

    const specificInstruction = typeSpecificInstructions[enhancementType] || typeSpecificInstructions.detailed;

    return `${baseInstruction}

${specificInstruction}

**Importante:** O prompt deve ser escrito no mesmo idioma do original do usuário. Não traduza.

Siga rigorosamente as melhores práticas de engenharia de prompt:
1. **Defina o papel (persona)** que o modelo deve assumir
2. **Inclua contexto relevante** de forma bem delimitada
3. **Use delimitadores** (ex: """texto""") para separar seções
4. **Especifique o formato da resposta** claramente
5. **Evite ambiguidade** e instruções vagas
6. **Garanta reutilização** do prompt final

---

Aqui está o prompt original digitado pelo usuário:

"""${userPrompt}"""

---

Com base nisso, reescreva um prompt completo, estruturado, eficaz e pronto para uso com LLMs, aplicando o estilo ${enhancementType.toUpperCase()} especificado acima. Apresente apenas o prompt final reescrito. Não inclua explicações adicionais.`;
  }

  private async generateSignature(method: string, url: string): Promise<{ signature: string; timestamp: string }> {
    const timestamp = new Date().toISOString();
    const apiUrl = `/api${url}`;
    const payload = `${method}:${apiUrl}:${timestamp}`;
    const encoder = new TextEncoder();
    const privateKey = encoder.encode(import.meta.env.VITE_PRIVATE_KEY);

    const key = await window.crypto.subtle.importKey(
      'raw',
      privateKey,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await window.crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const signature = Array.from(new Uint8Array(signatureBuffer))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');

    return { signature, timestamp };
  }

  private async makeRequest(prompt: string, enhancementType: string): Promise<string> {
    const { signature, timestamp } = await this.generateSignature('POST', '/llm');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/llm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-api-key': this.apiKey,
          'x-signature': signature,
          'x-timestamp': timestamp,
        },
        body: JSON.stringify({
          prompt: this.createPromptTemplate(prompt, enhancementType),
          provider: 'openai',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.output) {
        throw new Error('Resposta da API não contém o campo "output"');
      }

      return data.output;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async enhancePrompt(userPrompt: string, enhancementType: string = 'detailed'): Promise<ApiResponse> {
    if (!userPrompt?.trim()) {
      return {
        success: false,
        error: 'Prompt não pode estar vazio',
        enhancedPrompt: '',
      };
    }

    try {
      const enhancedPrompt = await this.makeRequest(userPrompt.trim(), enhancementType);

      return {
        success: true,
        enhancedPrompt: enhancedPrompt.trim(),
      };
    } catch (error) {
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
  const enhancementTemplates = {
    detailed: {
      prefix: "Você é um especialista em [área relevante]. Crie uma resposta abrangente e detalhada que",
      structure: `
**Contexto:** [Defina o contexto específico]
**Objetivo:** [Especifique o objetivo claro]
**Instruções:**
1. [Passo específico 1]
2. [Passo específico 2]
3. [Passo específico 3]

**Formato da Resposta:**
- Use estrutura hierárquica
- Inclua exemplos práticos
- Forneça justificativas para cada ponto
- Adicione considerações importantes

**Critérios de Qualidade:**
- Precisão técnica
- Aplicabilidade prática
- Clareza na comunicação`,
      modifiers: [
        "inclua exemplos específicos e insights acionáveis",
        "forneça orientação passo a passo detalhada",
        "incorpore contexto relevante e informações de background",
        "aborde desafios potenciais e soluções alternativas",
        "especifique métricas de sucesso e critérios de avaliação"
      ]
    },
    creative: {
      prefix: "Você é um pensador criativo e inovador. Gere uma resposta original e inspiradora que",
      structure: `
**Desafio Criativo:** [Reformule o problema de forma inspiradora]
**Perspectivas Múltiplas:** Explore pelo menos 3 abordagens diferentes
**Brainstorming:** 
- Ideias convencionais: [lista]
- Ideias inovadoras: [lista]
- Ideias disruptivas: [lista]

**Desenvolvimento Criativo:**
- Use analogias e metáforas
- Incorpore storytelling
- Pense em conexões inusitadas
- Explore o "e se...?"

**Resultado Esperado:**
- Soluções originais e viáveis
- Narrativa envolvente
- Múltiplas alternativas criativas`,
      modifiers: [
        "explore perspectivas únicas e abordagens não convencionais",
        "incorpore elementos narrativos e storytelling",
        "use linguagem vívida e inspiradora",
        "pense fora da caixa mantendo a relevância prática",
        "estimule brainstorming e geração de múltiplas ideias"
      ]
    },
    technical: {
      prefix: "Você é um especialista técnico sênior. Forneça uma resposta precisa e tecnicamente correta que",
      structure: `
**Especificações Técnicas:**
- Requisitos: [lista detalhada]
- Limitações: [constraints técnicos]
- Padrões aplicáveis: [standards relevantes]

**Implementação:**
- Arquitetura: [descrição técnica]
- Tecnologias: [stack recomendado]
- Configurações: [parâmetros específicos]

**Código/Exemplos:**
\`\`\`
[Exemplos de código ou configuração]
\`\`\`

**Considerações:**
- Performance e escalabilidade
- Segurança e compliance
- Manutenibilidade
- Documentação técnica`,
      modifiers: [
        "inclua especificações técnicas detalhadas e padrões",
        "cite fontes autoritativas e melhores práticas",
        "ofereça detalhes de implementação e exemplos de código",
        "aborde considerações de escalabilidade e performance",
        "forneça documentação técnica completa"
      ]
    },
    concise: {
      prefix: "Você é um consultor eficiente. Entregue uma resposta clara, direta e concisa que",
      structure: `
**Objetivo:** [Uma frase clara]
**Ação Requerida:** [O que fazer]
**Passos Essenciais:**
1. [Ação específica 1]
2. [Ação específica 2]
3. [Ação específica 3]

**Resultado Esperado:** [Outcome específico]
**Próximos Passos:** [Ações imediatas]

**Formato:** Bullet points, listas numeradas, máximo 200 palavras`,
      modifiers: [
        "foque nas informações mais essenciais e acionáveis",
        "use bullet points ou listas numeradas para clareza",
        "elimine detalhes desnecessários mantendo a completude",
        "forneça valor acionável imediato",
        "mantenha resposta objetiva e direta"
      ]
    },
    image: {
      prefix: "Crie um prompt detalhado para geração de imagem que descreva",
      structure: `
**Descrição Visual Principal:** [Elemento central da imagem]
**Estilo e Técnica:** [Estilo artístico, fotográfico, digital art, etc.]
**Composição:** [Enquadramento, perspectiva, regra dos terços]
**Iluminação:** [Tipo de luz, direção, intensidade, hora do dia]
**Cores e Paleta:** [Esquema de cores, saturação, temperatura]
**Textura e Detalhes:** [Superfícies, materiais, acabamentos]
**Atmosfera e Mood:** [Emoção, sentimento, energia]
**Qualidade Técnica:** [Resolução, nitidez, profundidade de campo]
**Elementos a Evitar:** [Negative prompts]

**Formato:** Prompt otimizado para IA de imagem`,
      modifiers: [
        "inclua descrições visuais específicas e detalhadas",
        "especifique estilo artístico e técnica de renderização",
        "defina iluminação, cores e composição precisamente",
        "adicione qualificadores de qualidade técnica",
        "inclua elementos de atmosfera e narrativa visual"
      ]
    },
    video: {
      prefix: "Desenvolva um prompt especializado para geração de vídeo que descreva",
      structure: `
**Sequência Principal:** [Ação ou movimento central]
**Duração e Ritmo:** [Tempo, velocidade, cadência]
**Cinematografia:** [Ângulos, movimentos de câmera, transições]
**Narrativa Temporal:** [Início, desenvolvimento, conclusão]
**Elementos Visuais:** [Cenário, personagens, objetos em movimento]
**Iluminação Dinâmica:** [Mudanças de luz ao longo do tempo]
**Qualidade Técnica:** [FPS, resolução, estabilização]
**Estilo Visual:** [Tratamento de cor, filtros, efeitos]
**Continuidade:** [Fluidez, coerência temporal]
**Especificações:** [Formato, codec, aspectos técnicos]

**Formato:** Prompt otimizado para IA de vídeo`,
      modifiers: [
        "descreva movimento e ação de forma específica",
        "inclua detalhes de cinematografia e direção",
        "especifique duração e ritmo da sequência",
        "defina qualidade técnica e especificações",
        "adicione elementos de narrativa temporal"
      ]
    }
  };

  const template = enhancementTemplates[type] || enhancementTemplates.detailed;
  const selectedModifiers = template.modifiers
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return `${template.prefix} ${prompt.toLowerCase()}.

${template.structure}

**Instruções Específicas:**
${selectedModifiers.map(modifier => `- ${modifier}`).join('\n')}

**Prompt Original:** "${prompt}"

**Importante:** Adapte todas as instruções acima ao contexto específico do prompt original, mantendo a estrutura e o estilo ${type}.`;
};