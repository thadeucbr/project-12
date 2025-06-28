// Background script para a extensão
chrome.runtime.onInstalled.addListener(() => {
  console.log('PromptCraft Text Enhancer instalado');
  
  // Configurações padrão
  chrome.storage.sync.set({
    apiUrl: 'http://localhost:3000/api',
    apiKey: '',
    privateKey: '',
    autoDetectContext: true,
    enhancementStyle: 'professional',
    showNotifications: true
  });
});

// Listener para mensagens do content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'enhanceText') {
    handleTextEnhancement(request.data)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indica resposta assíncrona
  }
  
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(null, (settings) => {
      sendResponse(settings);
    });
    return true;
  }
});

async function handleTextEnhancement(data) {
  const { text, context, style } = data;
  
  try {
    // Busca configurações
    const settings = await new Promise(resolve => {
      chrome.storage.sync.get(null, resolve);
    });
    
    if (!settings.apiKey || !settings.privateKey) {
      throw new Error('API não configurada. Configure nas opções da extensão.');
    }
    
    // Cria o prompt específico para melhoria de texto
    const enhancementPrompt = createTextEnhancementPrompt(text, context, style);
    
    // Gera assinatura
    const { signature, timestamp } = await generateSignature(
      'POST', 
      '/llm', 
      settings.privateKey
    );
    
    // Faz a requisição para a API
    const response = await fetch(`${settings.apiUrl}/llm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': settings.apiKey,
        'x-signature': signature,
        'x-timestamp': timestamp,
      },
      body: JSON.stringify({
        prompt: enhancementPrompt,
        provider: 'openai',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    const result = await response.json();
    return result.output;
    
  } catch (error) {
    console.error('Erro no aprimoramento:', error);
    // Fallback local
    return getLocalTextEnhancement(text, context, style);
  }
}

function createTextEnhancementPrompt(text, context, style) {
  const contextPrompts = {
    email: 'Você está aprimorando um email. Mantenha tom profissional mas amigável.',
    social: 'Você está aprimorando um post para redes sociais. Seja envolvente e conciso.',
    formal: 'Você está aprimorando um documento formal. Use linguagem profissional e precisa.',
    creative: 'Você está aprimorando um texto criativo. Seja expressivo e envolvente.',
    technical: 'Você está aprimorando documentação técnica. Seja claro e preciso.',
    comment: 'Você está aprimorando um comentário. Seja respeitoso e construtivo.',
    message: 'Você está aprimorando uma mensagem. Seja claro e cordial.',
    default: 'Você está aprimorando um texto geral. Melhore clareza e fluidez.'
  };
  
  const stylePrompts = {
    professional: 'Use tom profissional, formal mas acessível',
    casual: 'Use tom casual e amigável, mas mantenha clareza',
    creative: 'Use linguagem criativa e expressiva',
    concise: 'Seja o mais conciso possível mantendo o significado',
    detailed: 'Expanda com mais detalhes e explicações'
  };
  
  const contextInstruction = contextPrompts[context] || contextPrompts.default;
  const styleInstruction = stylePrompts[style] || stylePrompts.professional;
  
  return `Você é um especialista em redação e comunicação. Sua tarefa é aprimorar o texto fornecido, melhorando:

1. **Clareza e fluidez** da escrita
2. **Gramática e ortografia** 
3. **Estrutura e organização** das ideias
4. **Tom e estilo** apropriados ao contexto

**Contexto:** ${contextInstruction}
**Estilo desejado:** ${styleInstruction}

**Instruções específicas:**
- Mantenha o significado original do texto
- Preserve a intenção e personalidade do autor
- Corrija erros gramaticais e de ortografia
- Melhore a fluidez e legibilidade
- Adapte o tom ao contexto identificado
- NÃO adicione informações que não estavam no texto original
- Retorne APENAS o texto aprimorado, sem explicações

**Texto original:**
"""${text}"""

**Texto aprimorado:**`;
}

async function generateSignature(method, url, privateKey) {
  const timestamp = new Date().toISOString();
  const apiUrl = `/api${url}`;
  const payload = `${method}:${apiUrl}:${timestamp}`;
  
  const encoder = new TextEncoder();
  const keyData = encoder.encode(privateKey);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const signature = Array.from(new Uint8Array(signatureBuffer))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
  
  return { signature, timestamp };
}

function getLocalTextEnhancement(text, context, style) {
  // Fallback simples para quando a API não está disponível
  const improvements = {
    // Correções básicas
    ' ,': ',',
    ' .': '.',
    ' !': '!',
    ' ?': '?',
    '  ': ' ', // Remove espaços duplos
    // Melhorias de pontuação
    'nao': 'não',
    'voce': 'você',
    'esta': 'está',
    'nao': 'não'
  };
  
  let enhanced = text;
  
  // Aplica correções básicas
  Object.entries(improvements).forEach(([wrong, correct]) => {
    enhanced = enhanced.replace(new RegExp(wrong, 'gi'), correct);
  });
  
  // Capitaliza primeira letra
  enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
  
  // Adiciona ponto final se necessário
  if (!/[.!?]$/.test(enhanced.trim())) {
    enhanced += '.';
  }
  
  return enhanced;
}