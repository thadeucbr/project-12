// Script do popup da extensão
class PopupManager {
  constructor() {
    this.settings = {};
    this.init();
  }
  
  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.updateUI();
    this.loadUsageStats();
  }
  
  async loadSettings() {
    return new Promise(resolve => {
      chrome.storage.sync.get(null, (settings) => {
        this.settings = settings;
        resolve();
      });
    });
  }
  
  setupEventListeners() {
    // Toggle da extensão
    document.getElementById('toggle-extension').addEventListener('click', () => {
      this.toggleExtension();
    });
    
    // Abrir website
    document.getElementById('open-website').addEventListener('click', () => {
      chrome.tabs.create({ url: 'http://localhost:8090' });
    });
    
    // Testar aprimoramento
    document.getElementById('test-enhancement').addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://www.google.com' });
    });
    
    // Reconfigurar
    document.getElementById('reconfigure').addEventListener('click', () => {
      this.showAdvancedSettings();
    });
    
    // Salvar configurações
    document.getElementById('save-settings').addEventListener('click', () => {
      this.saveSettings();
    });
    
    // Toggles
    document.getElementById('auto-context').addEventListener('click', () => {
      this.toggleSwitch('auto-context', 'autoDetectContext');
    });
    
    document.getElementById('show-notifications').addEventListener('click', () => {
      this.toggleSwitch('show-notifications', 'showNotifications');
    });
    
    // Mudança de estilo padrão
    document.getElementById('default-style').addEventListener('change', (e) => {
      this.settings.enhancementStyle = e.target.value;
      chrome.storage.sync.set({ enhancementStyle: e.target.value });
    });
    
    // Mudança de provedor
    document.getElementById('provider-select').addEventListener('change', (e) => {
      this.settings.provider = e.target.value;
      this.loadModelsForProvider(e.target.value);
    });
    
    // Mudança de modelo
    document.getElementById('model-select').addEventListener('change', (e) => {
      this.settings.model = e.target.value;
      this.updateModelInfo();
    });
    
    // Links de ajuda
    document.getElementById('help-link').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: chrome.runtime.getURL('onboarding.html') });
    });
    
    document.getElementById('feedback-link').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://github.com/your-repo/promptcraft-extension/issues' });
    });
  }
  
  updateUI() {
    // Verifica se é primeira vez
    if (!this.settings.onboardingCompleted) {
      chrome.tabs.create({ url: chrome.runtime.getURL('onboarding.html') });
      window.close();
      return;
    }
    
    // Atualiza status
    this.updateStatus();
    
    // Atualiza informações do provedor
    this.updateProviderInfo();
    
    // Preenche campos
    document.getElementById('default-style').value = this.settings.enhancementStyle || 'professional';
    document.getElementById('provider-select').value = this.settings.provider || 'openai';
    document.getElementById('api-key').value = this.settings.apiKey || '';
    
    // Atualiza switches
    this.updateSwitch('auto-context', this.settings.autoDetectContext);
    this.updateSwitch('show-notifications', this.settings.showNotifications);
    
    // Atualiza botão toggle
    const isEnabled = this.settings.extensionEnabled !== false;
    document.getElementById('toggle-text').textContent = isEnabled ? 'Desativar' : 'Ativar';
    
    // Carrega modelos
    this.loadModelsForProvider(this.settings.provider);
  }
  
  updateStatus() {
    const statusEl = document.getElementById('status');
    const statusTextEl = document.getElementById('status-text');
    
    const hasApiKey = this.settings.apiKey && this.settings.apiKey.length > 0;
    const hasModel = this.settings.model && this.settings.model.length > 0;
    const isEnabled = this.settings.extensionEnabled !== false;
    const isOllama = this.settings.provider === 'ollama';
    
    if (!isEnabled) {
      statusEl.className = 'status inactive';
      statusTextEl.textContent = 'Extensão desativada';
    } else if (!isOllama && !hasApiKey) {
      statusEl.className = 'status warning';
      statusTextEl.textContent = 'Configure sua chave da API';
    } else if (!hasModel) {
      statusEl.className = 'status warning';
      statusTextEl.textContent = 'Selecione um modelo';
    } else {
      statusEl.className = 'status active';
      statusTextEl.textContent = 'Pronto para usar';
    }
  }
  
  updateProviderInfo() {
    const providerInfoEl = document.getElementById('provider-info');
    const providerBadgeEl = document.getElementById('provider-badge');
    const providerDetailsEl = document.getElementById('provider-details');
    
    if (!this.settings.provider) {
      providerInfoEl.classList.add('hidden');
      return;
    }
    
    const providerInfo = {
      openai: {
        name: 'OpenAI',
        class: 'openai',
        details: `Modelo: ${this.settings.model || 'Não selecionado'}<br>Custo: ~$0.002/1K tokens`
      },
      gemini: {
        name: 'Google Gemini',
        class: 'gemini',
        details: `Modelo: ${this.settings.model || 'Não selecionado'}<br>Gratuito: 60 req/min`
      },
      ollama: {
        name: 'Ollama (Local)',
        class: 'ollama',
        details: `Modelo: ${this.settings.model || 'Não selecionado'}<br>100% gratuito e privado`
      }
    };
    
    const info = providerInfo[this.settings.provider];
    if (info) {
      providerBadgeEl.textContent = info.name;
      providerBadgeEl.className = `provider-badge ${info.class}`;
      providerDetailsEl.innerHTML = info.details;
      providerInfoEl.classList.remove('hidden');
    }
  }
  
  updateSwitch(elementId, value) {
    const switchEl = document.getElementById(elementId);
    if (value) {
      switchEl.classList.add('active');
    } else {
      switchEl.classList.remove('active');
    }
  }
  
  toggleSwitch(elementId, settingKey) {
    const switchEl = document.getElementById(elementId);
    const isActive = switchEl.classList.contains('active');
    
    if (isActive) {
      switchEl.classList.remove('active');
      this.settings[settingKey] = false;
    } else {
      switchEl.classList.add('active');
      this.settings[settingKey] = true;
    }
    
    // Salva imediatamente
    chrome.storage.sync.set({ [settingKey]: this.settings[settingKey] });
  }
  
  toggleExtension() {
    const isEnabled = this.settings.extensionEnabled !== false;
    const newState = !isEnabled;
    
    this.settings.extensionEnabled = newState;
    chrome.storage.sync.set({ extensionEnabled: newState }, () => {
      this.updateUI();
      this.showNotification(
        newState ? 'Extensão ativada' : 'Extensão desativada'
      );
    });
  }
  
  showAdvancedSettings() {
    const advancedEl = document.getElementById('advanced-settings');
    const quickEl = document.getElementById('quick-settings');
    
    if (advancedEl.classList.contains('hidden')) {
      advancedEl.classList.remove('hidden');
      quickEl.classList.add('hidden');
    } else {
      advancedEl.classList.add('hidden');
      quickEl.classList.remove('hidden');
    }
  }
  
  async loadModelsForProvider(provider) {
    const modelSelect = document.getElementById('model-select');
    modelSelect.innerHTML = '<option value="">Carregando...</option>';
    
    try {
      const response = await new Promise(resolve => {
        chrome.runtime.sendMessage({
          action: 'getModels',
          provider: provider,
          apiKey: this.settings.apiKey
        }, resolve);
      });
      
      if (response.success) {
        this.populateModels(response.models);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
      this.populateModels(this.getDefaultModels(provider));
    }
  }
  
  populateModels(models) {
    const modelSelect = document.getElementById('model-select');
    modelSelect.innerHTML = '<option value="">Selecione um modelo...</option>';
    
    models.forEach(model => {
      const option = document.createElement('option');
      option.value = model.id;
      option.textContent = `${model.name}`;
      if (model.id === this.settings.model) {
        option.selected = true;
      }
      modelSelect.appendChild(option);
    });
    
    this.updateModelInfo();
  }
  
  updateModelInfo() {
    const modelInfoEl = document.getElementById('model-info');
    const selectedModel = document.getElementById('model-select').value;
    
    if (selectedModel) {
      const modelDescriptions = {
        'gpt-4': 'Modelo mais avançado, melhor qualidade',
        'gpt-3.5-turbo': 'Rápido e eficiente, boa qualidade',
        'gemini-pro': 'Modelo principal do Google',
        'llama2': 'Modelo local, privado e gratuito'
      };
      
      modelInfoEl.textContent = modelDescriptions[selectedModel] || 'Modelo selecionado';
    } else {
      modelInfoEl.textContent = '';
    }
  }
  
  getDefaultModels(provider) {
    const defaults = {
      openai: [
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Rápido e eficiente' },
        { id: 'gpt-4', name: 'GPT-4', description: 'Mais avançado' }
      ],
      gemini: [
        { id: 'gemini-pro', name: 'Gemini Pro', description: 'Modelo principal' }
      ],
      ollama: [
        { id: 'llama2', name: 'Llama 2', description: 'Meta Llama 2' }
      ]
    };
    
    return defaults[provider] || [];
  }
  
  saveSettings() {
    const newSettings = {
      provider: document.getElementById('provider-select').value,
      apiKey: document.getElementById('api-key').value.trim(),
      model: document.getElementById('model-select').value,
      enhancementStyle: document.getElementById('default-style').value,
      autoDetectContext: this.settings.autoDetectContext,
      showNotifications: this.settings.showNotifications,
      extensionEnabled: this.settings.extensionEnabled
    };
    
    // Validação básica
    if (newSettings.provider !== 'ollama' && !newSettings.apiKey) {
      this.showNotification('Chave da API é obrigatória', 'error');
      return;
    }
    
    if (!newSettings.model) {
      this.showNotification('Selecione um modelo', 'error');
      return;
    }
    
    // Salva configurações
    chrome.storage.sync.set(newSettings, () => {
      this.settings = { ...this.settings, ...newSettings };
      this.updateUI();
      this.showNotification('Configurações salvas com sucesso!');
      this.showAdvancedSettings(); // Volta para configurações rápidas
    });
  }
  
  async loadUsageStats() {
    // Carrega estatísticas de uso
    chrome.storage.local.get(['dailyCount', 'totalCount', 'lastResetDate'], (result) => {
      const today = new Date().toDateString();
      const lastReset = result.lastResetDate;
      
      let dailyCount = result.dailyCount || 0;
      
      // Reset diário
      if (lastReset !== today) {
        dailyCount = 0;
        chrome.storage.local.set({ 
          dailyCount: 0, 
          lastResetDate: today 
        });
      }
      
      document.getElementById('daily-count').textContent = dailyCount;
      document.getElementById('total-count').textContent = result.totalCount || 0;
    });
  }
  
  showNotification(message, type = 'success') {
    // Cria notificação temporária
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? '#EF4444' : '#22C55E'};
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Adiciona estilos para animações
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Inicializa quando o DOM carrega
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});