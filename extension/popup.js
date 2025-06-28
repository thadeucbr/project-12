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
    
    // Links de ajuda
    document.getElementById('help-link').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://github.com/your-repo/promptcraft-extension#readme' });
    });
    
    document.getElementById('feedback-link').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://github.com/your-repo/promptcraft-extension/issues' });
    });
  }
  
  updateUI() {
    // Atualiza status
    this.updateStatus();
    
    // Preenche campos
    document.getElementById('api-url').value = this.settings.apiUrl || 'http://localhost:3000/api';
    document.getElementById('api-key').value = this.settings.apiKey || '';
    document.getElementById('private-key').value = this.settings.privateKey || '';
    document.getElementById('default-style').value = this.settings.enhancementStyle || 'professional';
    
    // Atualiza switches
    this.updateSwitch('auto-context', this.settings.autoDetectContext);
    this.updateSwitch('show-notifications', this.settings.showNotifications);
    
    // Atualiza botão toggle
    const isEnabled = this.settings.extensionEnabled !== false;
    document.getElementById('toggle-text').textContent = isEnabled ? 'Desativar' : 'Ativar';
  }
  
  updateStatus() {
    const statusEl = document.getElementById('status');
    const statusTextEl = document.getElementById('status-text');
    
    const hasApiKey = this.settings.apiKey && this.settings.apiKey.length > 0;
    const hasPrivateKey = this.settings.privateKey && this.settings.privateKey.length > 0;
    const isEnabled = this.settings.extensionEnabled !== false;
    
    if (!isEnabled) {
      statusEl.className = 'status inactive';
      statusTextEl.textContent = 'Extensão desativada';
    } else if (!hasApiKey || !hasPrivateKey) {
      statusEl.className = 'status inactive';
      statusTextEl.textContent = 'Configure as chaves da API';
    } else {
      statusEl.className = 'status active';
      statusTextEl.textContent = 'Pronto para usar';
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
  
  saveSettings() {
    const newSettings = {
      apiUrl: document.getElementById('api-url').value.trim(),
      apiKey: document.getElementById('api-key').value.trim(),
      privateKey: document.getElementById('private-key').value.trim(),
      enhancementStyle: document.getElementById('default-style').value,
      autoDetectContext: this.settings.autoDetectContext,
      showNotifications: this.settings.showNotifications
    };
    
    // Validação básica
    if (!newSettings.apiUrl) {
      this.showNotification('URL da API é obrigatória', 'error');
      return;
    }
    
    if (!newSettings.apiKey) {
      this.showNotification('Chave da API é obrigatória', 'error');
      return;
    }
    
    if (!newSettings.privateKey) {
      this.showNotification('Chave privada é obrigatória', 'error');
      return;
    }
    
    // Salva configurações
    chrome.storage.sync.set(newSettings, () => {
      this.settings = { ...this.settings, ...newSettings };
      this.updateUI();
      this.showNotification('Configurações salvas com sucesso!');
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