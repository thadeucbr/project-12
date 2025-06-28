// Script do onboarding
class OnboardingManager {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 5;
    this.selectedProvider = null;
    this.apiKey = '';
    this.selectedModel = '';
    this.settings = {};
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updateUI();
  }
  
  setupEventListeners() {
    // Botões de navegação
    document.getElementById('next-btn').addEventListener('click', () => this.nextStep());
    document.getElementById('prev-btn').addEventListener('click', () => this.prevStep());
    
    // Seleção de provedor
    document.querySelectorAll('.provider-card').forEach(card => {
      card.addEventListener('click', () => {
        this.selectProvider(card.dataset.provider);
      });
    });
    
    // Input da API key
    document.getElementById('api-key').addEventListener('input', (e) => {
      this.apiKey = e.target.value.trim();
      this.updateNextButton();
    });
    
    // Seleção de modelo
    document.getElementById('model-select').addEventListener('change', (e) => {
      this.selectedModel = e.target.value;
      this.updateNextButton();
    });
  }
  
  selectProvider(provider) {
    this.selectedProvider = provider;
    
    // Atualiza visual
    document.querySelectorAll('.provider-card').forEach(card => {
      card.classList.remove('selected');
    });
    document.querySelector(`[data-provider="${provider}"]`).classList.add('selected');
    
    this.updateNextButton();
  }
  
  async nextStep() {
    if (this.currentStep === 1) {
      if (!this.selectedProvider) {
        alert('Por favor, selecione um provedor de IA');
        return;
      }
      this.showProviderGuide();
    }
    
    if (this.currentStep === 2) {
      if (!this.apiKey && this.selectedProvider !== 'ollama') {
        alert('Por favor, insira sua chave da API');
        return;
      }
      await this.loadModels();
    }
    
    if (this.currentStep === 3) {
      if (!this.selectedModel) {
        alert('Por favor, selecione um modelo');
        return;
      }
    }
    
    if (this.currentStep === 4) {
      await this.saveSettings();
    }
    
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateUI();
    }
  }
  
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateUI();
    }
  }
  
  updateUI() {
    // Atualiza barra de progresso
    const progress = (this.currentStep / this.totalSteps) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    
    // Mostra/esconde steps
    document.querySelectorAll('.step').forEach((step, index) => {
      step.classList.toggle('active', index + 1 === this.currentStep);
    });
    
    // Atualiza botões
    document.getElementById('prev-btn').style.display = this.currentStep > 1 ? 'block' : 'none';
    
    const nextBtn = document.getElementById('next-btn');
    if (this.currentStep === this.totalSteps) {
      nextBtn.textContent = 'Finalizar';
      nextBtn.onclick = () => this.finish();
    } else {
      nextBtn.textContent = 'Próximo';
    }
    
    this.updateNextButton();
  }
  
  updateNextButton() {
    const nextBtn = document.getElementById('next-btn');
    let canProceed = false;
    
    switch (this.currentStep) {
      case 1:
        canProceed = !!this.selectedProvider;
        break;
      case 2:
        canProceed = this.selectedProvider === 'ollama' || !!this.apiKey;
        break;
      case 3:
        canProceed = !!this.selectedModel;
        break;
      default:
        canProceed = true;
    }
    
    nextBtn.disabled = !canProceed;
  }
  
  showProviderGuide() {
    const guides = {
      openai: {
        title: '🤖 Como obter sua chave da OpenAI',
        steps: [
          'Acesse <a href="https://platform.openai.com/signup" target="_blank">platform.openai.com</a>',
          'Crie uma conta ou faça login',
          'Vá para <a href="https://platform.openai.com/api-keys" target="_blank">API Keys</a>',
          'Clique em "Create new secret key"',
          'Copie a chave gerada (começa com "sk-")',
          'Cole a chave no campo abaixo'
        ],
        note: '💡 Você precisará adicionar créditos na sua conta OpenAI para usar a API.'
      },
      gemini: {
        title: '🧠 Como obter sua chave do Google Gemini',
        steps: [
          'Acesse <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a>',
          'Faça login com sua conta Google',
          'Clique em "Create API Key"',
          'Selecione um projeto ou crie um novo',
          'Copie a chave gerada',
          'Cole a chave no campo abaixo'
        ],
        note: '💡 O Gemini oferece uso gratuito generoso - perfeito para começar!'
      },
      ollama: {
        title: '🏠 Como configurar o Ollama (Local)',
        steps: [
          'Baixe o Ollama em <a href="https://ollama.ai" target="_blank">ollama.ai</a>',
          'Instale o aplicativo no seu computador',
          'Abra o terminal/prompt de comando',
          'Execute: <code>ollama pull llama2</code>',
          'Aguarde o download do modelo',
          'Execute: <code>ollama serve</code> para iniciar'
        ],
        note: '💡 O Ollama roda localmente - seus dados ficam no seu computador!'
      }
    };
    
    const guide = guides[this.selectedProvider];
    const guideContent = document.getElementById('guide-content');
    
    guideContent.innerHTML = `
      <div class="guide-box">
        <div class="guide-title">
          ${guide.title}
        </div>
        <ol class="guide-steps">
          ${guide.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
        <div style="margin-top: 16px; padding: 12px; background: rgba(255, 193, 7, 0.2); border-radius: 8px; font-size: 14px;">
          ${guide.note}
        </div>
      </div>
    `;
    
    // Para Ollama, não precisa de API key
    if (this.selectedProvider === 'ollama') {
      document.querySelector('.form-group').style.display = 'none';
      this.apiKey = 'local';
    } else {
      document.querySelector('.form-group').style.display = 'block';
    }
  }
  
  async loadModels() {
    const modelSelect = document.getElementById('model-select');
    const loadingDiv = document.getElementById('model-loading');
    
    modelSelect.style.display = 'none';
    loadingDiv.style.display = 'block';
    
    try {
      // Simula chamada para buscar modelos
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({
          action: 'getModels',
          provider: this.selectedProvider,
          apiKey: this.apiKey
        }, resolve);
      });
      
      if (response.success) {
        this.populateModels(response.models);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
      this.populateModels(this.getDefaultModels());
    } finally {
      modelSelect.style.display = 'block';
      loadingDiv.style.display = 'none';
    }
  }
  
  populateModels(models) {
    const modelSelect = document.getElementById('model-select');
    modelSelect.innerHTML = '<option value="">Selecione um modelo...</option>';
    
    models.forEach(model => {
      const option = document.createElement('option');
      option.value = model.id;
      option.textContent = `${model.name} - ${model.description}`;
      modelSelect.appendChild(option);
    });
    
    // Seleciona o primeiro modelo por padrão
    if (models.length > 0) {
      modelSelect.value = models[0].id;
      this.selectedModel = models[0].id;
    }
  }
  
  getDefaultModels() {
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
    
    return defaults[this.selectedProvider] || [];
  }
  
  async saveSettings() {
    this.settings = {
      onboardingCompleted: true,
      provider: this.selectedProvider,
      apiKey: this.apiKey,
      model: this.selectedModel,
      enhancementStyle: document.getElementById('default-style').value,
      autoDetectContext: true,
      showNotifications: true,
      extensionEnabled: true
    };
    
    return new Promise(resolve => {
      chrome.storage.sync.set(this.settings, resolve);
    });
  }
  
  finish() {
    // Fecha a aba de onboarding
    chrome.tabs.getCurrent((tab) => {
      chrome.tabs.remove(tab.id);
    });
    
    // Abre uma nova aba para testar
    chrome.tabs.create({ url: 'https://www.google.com' });
  }
}

// Inicializa quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  new OnboardingManager();
});