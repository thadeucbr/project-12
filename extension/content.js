// Content script que roda em todas as páginas
class TextEnhancer {
  constructor() {
    this.isEnabled = true;
    this.currentField = null;
    this.enhanceButton = null;
    this.tooltip = null;
    this.settings = {};
    
    this.init();
  }
  
  async init() {
    // Carrega configurações
    await this.loadSettings();
    
    // Adiciona estilos
    this.addStyles();
    
    // Monitora campos de texto
    this.observeTextFields();
    
    // Escuta mudanças no DOM
    this.observeDOM();
    
    console.log('PromptCraft Text Enhancer ativo');
  }
  
  async loadSettings() {
    return new Promise(resolve => {
      chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
        this.settings = response || {};
        resolve();
      });
    });
  }
  
  addStyles() {
    if (document.getElementById('promptcraft-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'promptcraft-styles';
    style.textContent = `
      .promptcraft-enhance-btn {
        position: absolute;
        width: 24px;
        height: 24px;
        background: linear-gradient(135deg, #8B5CF6, #EC4899);
        border: none;
        border-radius: 6px;
        cursor: pointer;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
        transition: all 0.2s ease;
        opacity: 0.8;
      }
      
      .promptcraft-enhance-btn:hover {
        opacity: 1;
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
      }
      
      .promptcraft-enhance-btn svg {
        width: 14px;
        height: 14px;
        fill: white;
      }
      
      .promptcraft-enhance-btn.loading {
        animation: promptcraft-spin 1s linear infinite;
      }
      
      @keyframes promptcraft-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .promptcraft-tooltip {
        position: absolute;
        background: #1F2937;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        z-index: 10001;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
        white-space: nowrap;
      }
      
      .promptcraft-tooltip.show {
        opacity: 1;
      }
      
      .promptcraft-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 4px solid transparent;
        border-top-color: #1F2937;
      }
      
      .promptcraft-enhanced {
        background: linear-gradient(90deg, #F3E8FF, #FDF2F8) !important;
        border: 1px solid #8B5CF6 !important;
        transition: background 0.3s ease;
      }
      
      .promptcraft-context-menu {
        position: absolute;
        background: white;
        border: 1px solid #E5E7EB;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10002;
        padding: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        min-width: 200px;
      }
      
      .promptcraft-context-item {
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 4px;
        transition: background 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .promptcraft-context-item:hover {
        background: #F3F4F6;
      }
      
      .promptcraft-context-item.selected {
        background: #EDE9FE;
        color: #7C3AED;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  observeTextFields() {
    // Seleciona todos os campos de texto
    const textFields = document.querySelectorAll(`
      textarea,
      input[type="text"],
      input[type="email"],
      [contenteditable="true"],
      .ql-editor,
      .CodeMirror-code,
      .ace_text-input
    `);
    
    textFields.forEach(field => this.setupField(field));
  }
  
  observeDOM() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const textFields = node.querySelectorAll(`
              textarea,
              input[type="text"],
              input[type="email"],
              [contenteditable="true"],
              .ql-editor
            `);
            textFields.forEach(field => this.setupField(field));
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  setupField(field) {
    if (field.dataset.promptcraftSetup) return;
    field.dataset.promptcraftSetup = 'true';
    
    // Ignora campos muito pequenos ou de senha
    if (field.type === 'password' || 
        field.offsetWidth < 100 || 
        field.offsetHeight < 30) {
      return;
    }
    
    field.addEventListener('focus', () => this.showEnhanceButton(field));
    field.addEventListener('blur', () => {
      setTimeout(() => this.hideEnhanceButton(), 200);
    });
    field.addEventListener('input', () => this.updateButtonPosition(field));
  }
  
  showEnhanceButton(field) {
    this.currentField = field;
    
    if (!this.enhanceButton) {
      this.createEnhanceButton();
    }
    
    this.updateButtonPosition(field);
    this.enhanceButton.style.display = 'flex';
  }
  
  hideEnhanceButton() {
    if (this.enhanceButton && !this.enhanceButton.matches(':hover')) {
      this.enhanceButton.style.display = 'none';
    }
  }
  
  createEnhanceButton() {
    this.enhanceButton = document.createElement('button');
    this.enhanceButton.className = 'promptcraft-enhance-btn';
    this.enhanceButton.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
      </svg>
    `;
    
    this.enhanceButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showContextMenu(e);
    });
    
    this.enhanceButton.addEventListener('mouseenter', () => {
      this.showTooltip('Clique para aprimorar o texto');
    });
    
    this.enhanceButton.addEventListener('mouseleave', () => {
      this.hideTooltip();
    });
    
    document.body.appendChild(this.enhanceButton);
  }
  
  updateButtonPosition(field) {
    if (!this.enhanceButton) return;
    
    const rect = field.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    this.enhanceButton.style.left = `${rect.right - 30 + scrollLeft}px`;
    this.enhanceButton.style.top = `${rect.top + 4 + scrollTop}px`;
  }
  
  showContextMenu(event) {
    const text = this.getFieldText(this.currentField);
    
    if (!text.trim()) {
      this.showTooltip('Digite algum texto primeiro');
      return;
    }
    
    // Remove menu existente
    const existingMenu = document.querySelector('.promptcraft-context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }
    
    const menu = document.createElement('div');
    menu.className = 'promptcraft-context-menu';
    
    const context = this.detectContext(this.currentField);
    const options = [
      { id: 'professional', label: '✨ Profissional', desc: 'Tom formal e claro' },
      { id: 'casual', label: '😊 Casual', desc: 'Tom amigável e descontraído' },
      { id: 'creative', label: '🎨 Criativo', desc: 'Mais expressivo e envolvente' },
      { id: 'concise', label: '⚡ Conciso', desc: 'Mais direto e objetivo' },
      { id: 'detailed', label: '📝 Detalhado', desc: 'Mais completo e explicativo' }
    ];
    
    options.forEach(option => {
      const item = document.createElement('div');
      item.className = 'promptcraft-context-item';
      item.innerHTML = `
        <span>${option.label}</span>
        <small style="color: #6B7280; margin-left: auto;">${option.desc}</small>
      `;
      
      item.addEventListener('click', () => {
        this.enhanceText(text, context, option.id);
        menu.remove();
      });
      
      menu.appendChild(item);
    });
    
    // Posiciona o menu
    const rect = this.enhanceButton.getBoundingClientRect();
    menu.style.left = `${rect.left - 100}px`;
    menu.style.top = `${rect.bottom + 5}px`;
    
    document.body.appendChild(menu);
    
    // Remove menu ao clicar fora
    setTimeout(() => {
      document.addEventListener('click', function removeMenu(e) {
        if (!menu.contains(e.target)) {
          menu.remove();
          document.removeEventListener('click', removeMenu);
        }
      });
    }, 100);
  }
  
  detectContext(field) {
    const fieldType = field.type || 'text';
    const fieldName = (field.name || '').toLowerCase();
    const fieldId = (field.id || '').toLowerCase();
    const fieldClass = (field.className || '').toLowerCase();
    const placeholder = (field.placeholder || '').toLowerCase();
    
    // Detecta contexto baseado em atributos do campo
    if (fieldType === 'email' || fieldName.includes('email') || fieldId.includes('email')) {
      return 'email';
    }
    
    if (fieldName.includes('comment') || fieldId.includes('comment') || placeholder.includes('comment')) {
      return 'comment';
    }
    
    if (fieldName.includes('message') || fieldId.includes('message') || placeholder.includes('message')) {
      return 'message';
    }
    
    if (fieldClass.includes('social') || fieldClass.includes('post') || fieldClass.includes('tweet')) {
      return 'social';
    }
    
    if (fieldClass.includes('code') || fieldClass.includes('technical')) {
      return 'technical';
    }
    
    // Detecta baseado no contexto da página
    const url = window.location.href.toLowerCase();
    if (url.includes('linkedin') || url.includes('twitter') || url.includes('facebook')) {
      return 'social';
    }
    
    if (url.includes('github') || url.includes('stackoverflow')) {
      return 'technical';
    }
    
    if (url.includes('gmail') || url.includes('outlook') || url.includes('mail')) {
      return 'email';
    }
    
    return 'default';
  }
  
  getFieldText(field) {
    if (field.contentEditable === 'true') {
      return field.textContent || field.innerText || '';
    }
    return field.value || '';
  }
  
  setFieldText(field, text) {
    if (field.contentEditable === 'true') {
      field.textContent = text;
      // Dispara evento de input para frameworks
      field.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      field.value = text;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
  
  async enhanceText(text, context, style) {
    this.enhanceButton.classList.add('loading');
    this.showTooltip('Aprimorando texto...');
    
    try {
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          action: 'enhanceText',
          data: { text, context, style }
        }, (response) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(response.error));
          }
        });
      });
      
      // Aplica o texto aprimorado
      this.setFieldText(this.currentField, response);
      
      // Adiciona efeito visual
      this.currentField.classList.add('promptcraft-enhanced');
      setTimeout(() => {
        this.currentField.classList.remove('promptcraft-enhanced');
      }, 2000);
      
      this.showTooltip('Texto aprimorado! ✨', 2000);
      
    } catch (error) {
      console.error('Erro ao aprimorar texto:', error);
      this.showTooltip('Erro: ' + error.message, 3000);
    } finally {
      this.enhanceButton.classList.remove('loading');
    }
  }
  
  showTooltip(text, duration = 1000) {
    if (!this.tooltip) {
      this.tooltip = document.createElement('div');
      this.tooltip.className = 'promptcraft-tooltip';
      document.body.appendChild(this.tooltip);
    }
    
    this.tooltip.textContent = text;
    
    const rect = this.enhanceButton.getBoundingClientRect();
    this.tooltip.style.left = `${rect.left + rect.width / 2}px`;
    this.tooltip.style.top = `${rect.top - 35}px`;
    this.tooltip.style.transform = 'translateX(-50%)';
    
    this.tooltip.classList.add('show');
    
    clearTimeout(this.tooltipTimeout);
    this.tooltipTimeout = setTimeout(() => {
      this.hideTooltip();
    }, duration);
  }
  
  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.classList.remove('show');
    }
  }
}

// Inicializa quando a página carrega
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new TextEnhancer();
  });
} else {
  new TextEnhancer();
}