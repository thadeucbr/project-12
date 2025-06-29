// Background script para a extensão
chrome.runtime.onInstalled.addListener((details) => {
  console.log('PromptCraft Text Enhancer instalado');
  
  if (details.reason === 'install') {
    // Primeira instalação - abre onboarding
    chrome.tabs.create({ url: chrome.runtime.getURL('onboarding.html') });
  }
  
  // Configurações padrão
  chrome.storage.sync.set({
    isFirstTime: details.reason === 'install',
    onboardingCompleted: false,
    provider: 'openai', // openai, gemini, ollama
    apiKey: '',
    model: '',
    autoDetectContext: true,
    enhancementStyle: 'professional',
    showNotifications: true,
    extensionEnabled: true
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
  
  if (request.action === 'getModels') {
    getAvailableModels(request.provider, request.apiKey)
      .then(models => sendResponse({ success: true, models }))
      .catch(error => sendResponse({ success: false, error: error.message }));
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
    
    if (!settings.apiKey || !settings.provider) {
      throw new Error('Configure sua API primeiro. Clique no ícone da extensão para configurar.');
    }
    
    // Cria o prompt específico para melhoria de texto
    const enhancementPrompt = createTextEnhancementPrompt(text, context, style);
    
    // Chama a API baseada no provedor
    let result;
    switch (settings.provider) {
      case 'openai':
        result = await callOpenAI(enhancementPrompt, settings);
        break;
      case 'gemini':
        result = await callGemini(enhancementPrompt, settings);
        break;
      case 'ollama':
        result = await callOllama(enhancementPrompt, settings);
        break;
      default:
        throw new Error('Provedor não suportado');
    }
    
    // Limpa e valida o resultado
    const cleanedResult = cleanAndValidateText(result, text);
    return cleanedResult;
    
  } catch (error) {
    console.error('Erro no aprimoramento:', error);
    // Fallback local
    return getLocalTextEnhancement(text, context, style);
  }
}

function cleanAndValidateText(enhancedText, originalText) {
  if (!enhancedText || typeof enhancedText !== 'string') {
    throw new Error('Resposta inválida da API');
  }
  
  // Remove caracteres de controle e normaliza
  let cleaned = enhancedText
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove caracteres de controle
    .replace(/\u00A0/g, ' ') // Substitui espaços não-quebráveis
    .trim();
  
  // Remove possíveis prefixos de instrução
  const prefixes = [
    'texto aprimorado:',
    'enhanced text:',
    'improved text:',
    'resultado:',
    'result:',
    'aqui está:',
    'here is:',
    'versão melhorada:',
    'improved version:'
  ];
  
  for (const prefix of prefixes) {
    if (cleaned.toLowerCase().startsWith(prefix)) {
      cleaned = cleaned.substring(prefix.length).trim();
    }
  }
  
  // Remove aspas desnecessárias
  cleaned = cleaned.replace(/^["']|["']$/g, '');
  
  // Verifica se o texto não ficou muito diferente do original
  if (cleaned.length < originalText.length * 0.3) {
    console.warn('Texto aprimorado muito curto, usando fallback');
    return getLocalTextEnhancement(originalText, 'default', 'professional');
  }
  
  // Verifica se não há caracteres estranhos repetitivos
  if (/(.)\1{10,}/.test(cleaned)) {
    console.warn('Texto com caracteres repetitivos detectado, usando fallback');
    return getLocalTextEnhancement(originalText, 'default', 'professional');
  }
  
  return cleaned;
}

async function callOpenAI(prompt, settings) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${settings.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: settings.model || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
  }
  
  const result = await response.json();
  
  if (!result.choices || !result.choices[0] || !result.choices[0].message) {
    throw new Error('Resposta inválida da OpenAI API');
  }
  
  return result.choices[0].message.content;
}

async function callGemini(prompt, settings) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${settings.model || 'gemini-pro'}:generateContent?key=${settings.apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API Error: ${error.error?.message || response.statusText}`);
  }
  
  const result = await response.json();
  
  if (!result.candidates || !result.candidates[0] || !result.candidates[0].content) {
    throw new Error('Resposta inválida da Gemini API');
  }
  
  return result.candidates[0].content.parts[0].text;
}

async function callOllama(prompt, settings) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: settings.model || 'llama2',
      prompt: prompt,
      stream: false
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Ollama Error: ${response.statusText}. Certifique-se de que o Ollama está rodando.`);
  }
  
  const result = await response.json();
  
  if (!result.response) {
    throw new Error('Resposta inválida do Ollama');
  }
  
  return result.response;
}

async function getAvailableModels(provider, apiKey) {
  try {
    switch (provider) {
      case 'openai':
        return await getOpenAIModels(apiKey);
      case 'gemini':
        return await getGeminiModels(apiKey);
      case 'ollama':
        return await getOllamaModels();
      default:
        return [];
    }
  } catch (error) {
    console.error('Erro ao buscar modelos:', error);
    return getDefaultModels(provider);
  }
}

async function getOpenAIModels(apiKey) {
  const response = await fetch('https://api.openai.com/v1/models', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });
  
  if (!response.ok) {
    return getDefaultModels('openai');
  }
  
  const result = await response.json();
  return result.data
    .filter(model => model.id.includes('gpt'))
    .map(model => ({
      id: model.id,
      name: model.id,
      description: `OpenAI ${model.id}`
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function getGeminiModels(apiKey) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  
  if (!response.ok) {
    return getDefaultModels('gemini');
  }
  
  const result = await response.json();
  return result.models
    .filter(model => model.name.includes('gemini'))
    .map(model => ({
      id: model.name.split('/').pop(),
      name: model.displayName || model.name.split('/').pop(),
      description: model.description || `Google ${model.name.split('/').pop()}`
    }));
}

async function getOllamaModels() {
  const response = await fetch('http://localhost:11434/api/tags');
  
  if (!response.ok) {
    return getDefaultModels('ollama');
  }
  
  const result = await response.json();
  return result.models.map(model => ({
    id: model.name,
    name: model.name,
    description: `Ollama ${model.name} (${(model.size / 1024 / 1024 / 1024).toFixed(1)}GB)`
  }));
}

function getDefaultModels(provider) {
  const defaults = {
    openai: [
      { id: 'gpt-4', name: 'GPT-4', description: 'Modelo mais avançado da OpenAI' },
      { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo', description: 'Versão mais rápida do GPT-4' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Modelo rápido e eficiente' },
      { id: 'gpt-3.5-turbo-16k', name: 'GPT-3.5 Turbo 16K', description: 'Versão com mais contexto' }
    ],
    gemini: [
      { id: 'gemini-pro', name: 'Gemini Pro', description: 'Modelo principal do Google' },
      { id: 'gemini-pro-vision', name: 'Gemini Pro Vision', description: 'Modelo com suporte a imagens' }
    ],
    ollama: [
      { id: 'llama2', name: 'Llama 2', description: 'Meta Llama 2' },
      { id: 'codellama', name: 'Code Llama', description: 'Especializado em código' },
      { id: 'mistral', name: 'Mistral', description: 'Modelo Mistral AI' },
      { id: 'neural-chat', name: 'Neural Chat', description: 'Modelo de conversação' }
    ]
  };
  
  return defaults[provider] || [];
}

function createTextEnhancementPrompt(text, context, style) {
  const contextPrompts = {
    email: 'Improve this email text to be more professional and clear',
    social: 'Improve this social media post to be more engaging and concise',
    formal: 'Improve this formal text to be more professional and precise',
    creative: 'Improve this creative text to be more expressive and engaging',
    technical: 'Improve this technical text to be clearer and more precise',
    comment: 'Improve this comment to be more respectful and constructive',
    message: 'Improve this message to be clearer and more cordial',
    default: 'Improve this text to be clearer and more fluent'
  };
  
  const stylePrompts = {
    professional: 'Use a professional, formal but accessible tone',
    casual: 'Use a casual and friendly tone while maintaining clarity',
    creative: 'Use creative and expressive language',
    concise: 'Be as concise as possible while maintaining meaning',
    detailed: 'Expand with more details and explanations'
  };
  
  const contextInstruction = contextPrompts[context] || contextPrompts.default;
  const styleInstruction = stylePrompts[style] || stylePrompts.professional;
  
  return `${contextInstruction}. ${styleInstruction}. Keep the original meaning and intention. Return only the improved text without explanations.

Original text: ${text}

Improved text:`;
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