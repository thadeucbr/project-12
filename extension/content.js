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
    
    // Verifica se a extensão está habilitada
    if (!this.settings.extensionEnabled) {
      return;
    }
    
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
        position: absolute !important;
        width: 28px !important;
        height: 28px !important;
        background: linear-gradient(135deg, #8B5CF6, #EC4899) !important;
        border: none !important;
        border-radius: 8px !important;
        cursor: pointer !important;
        z-index: 2147483647 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3) !important;
        transition: all 0.2s ease !important;
        opacity: 0.9 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }

      .promptcraft-enhance-btn:hover {
        opacity: 1 !important;
        transform: scale(1.1) !important;
        box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4) !important;
      }

      .promptcraft-enhance-btn svg {
        width: 16px !important;
        height: 16px !important;
        fill: white !important;
        pointer-events: none !important;
      }

      .promptcraft-enhance-btn.loading {
        animation: promptcraft-spin 1s linear infinite !important;
      }

      @keyframes promptcraft-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .promptcraft-tooltip {
        position: absolute !important;
        background: #1F2937 !important;
        color: white !important;
        padding: 8px 12px !important;
        border-radius: 6px !important;
        font-size: 12px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        z-index: 2147483647 !important;
        pointer-events: none !important;
        opacity: 0 !important;
        transition: opacity 0.2s ease !important;
        white-space: nowrap !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        max-width: 200px !important;
      }

      .promptcraft-tooltip.show {
        opacity: 1 !important;
      }

      .promptcraft-tooltip::after {
        content: '' !important;
        position: absolute !important;
        top: 100% !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        border: 4px solid transparent !important;
        border-top-color: #1F2937 !important;
      }

      .promptcraft-enhanced {
        background: linear-gradient(90deg, #F3E8FF, #FDF2F8) !important;
        border: 2px solid #8B5CF6 !important;
        transition: all 0.3s ease !important;
      }

      .promptcraft-context-menu {
        position: absolute !important;
        background: white !important;
        border: 1px solid #E5E7EB !important;
        border-radius: 12px !important;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
        z-index: 2147483647 !important;
        padding: 8px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 14px !important;
        min-width: 220px !important;
        max-width: 300px !important;
        backdrop-filter: blur(10px) !important;
      }

      .promptcraft-context-item {
        padding: 12px 16px !important;
        cursor: pointer !important;
        border-radius: 8px !important;
        transition: all 0.2s ease !important;
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        color: #374151 !important;
        margin-bottom: 4px !important;
      }

      .promptcraft-context-item:hover {
        background: #F3F4F6 !important;
        transform: translateX(2px) !important;
      }

      .promptcraft-context-item.selected {
        background: #EDE9FE !important;
        color: #7C3AED !important;
      }

      .promptcraft-context-icon {
        font-size: 16px !important;
        width: 20px !important;
        text-align: center !important;
      }

      .promptcraft-context-text {
        flex: 1 !important;
      }

      .promptcraft-context-desc {
        font-size: 11px !important;
        opacity: 0.7 !important;
        margin-top: 2px !important;
      }

      /* Animação de sucesso */
      @keyframes promptcraft-success {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); background: #22C55E; }
        100% { transform: scale(1); }
      }

      .promptcraft-enhance-btn.success {
        animation: promptcraft-success 0.6s ease !important;
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
      input[type="search"],
      [contenteditable="true"],
      .ql-editor,
      .CodeMirror-code,
      .ace_text-input,
      [role="textbox"]
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
              input[type="search"],
              [contenteditable="true"],
              .ql-editor,
              [role="textbox"]
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
    
    // Ignora campos muito pequenos, de senha ou ocultos
    if (field.type === 'password' || 
        field.type === 'hidden' ||
        field.offsetWidth < 100 || 
        field.offsetHeight < 30 ||
        field.style.display === 'none') {
      return;
    }
    
    // Ignora campos de busca muito pequenos
    if (field.type === 'search' && field.offsetWidth < 200) {
      return;
    }
    
    field.addEventListener('focus', () => this.showEnhanceButton(field));
    field.addEventListener('blur', () => {
      setTimeout(() => this.hideEnhanceButton(), 200);
    });
    field.addEventListener('input', () => this.updateButtonPosition(field));
    field.addEventListener('scroll', () => this.updateButtonPosition(field));
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
      this.showTooltip('Clique para aprimorar o texto ✨');
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
    
    // Posiciona no canto superior direito do campo
    this.enhanceButton.style.left = `${rect.right - 35 + scrollLeft}px`;
    this.enhanceButton.style.top = `${rect.top + 5 + scrollTop}px`;
  }
  
  showContextMenu(event) {
    const text = this.getFieldText(this.currentField);
    
    if (!text.trim()) {
      this.showTooltip('Digite algum texto primeiro', 2000);
      return;
    }
    
    if (text.length < 10) {
      this.showTooltip('Texto muito curto para aprimorar', 2000);
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
      { 
        id: 'professional', 
        icon: '✨', 
        label: 'Profissional', 
        desc: 'Tom formal e claro' 
      },
      { 
        id: 'casual', 
        icon: '😊', 
        label: 'Casual', 
        desc: 'Amigável e descontraído' 
      },
      { 
        id: 'creative', 
        icon: '🎨', 
        label: 'Criativo', 
        desc: 'Expressivo e envolvente' 
      },
      { 
        id: 'concise', 
        icon: '⚡', 
        label: 'Conciso', 
        desc: 'Direto ao ponto' 
      },
      { 
        id: 'detailed', 
        icon: '📝', 
        label: 'Detalhado', 
        desc: 'Mais completo' 
      }
    ];
    
    options.forEach(option => {
      const item = document.createElement('div');
      item.className = 'promptcraft-context-item';
      
      // Marca o estilo padrão
      if (option.id === this.settings.enhancementStyle) {
        item.classList.add('selected');
      }
      
      item.innerHTML = `
        <div class="promptcraft-context-icon">${option.icon}</div>
        <div class="promptcraft-context-text">
          <div>${option.label}</div>
          <div class="promptcraft-context-desc">${option.desc}</div>
        </div>
      `;
      
      item.addEventListener('click', () => {
        this.enhanceText(text, context, option.id);
        menu.remove();
      });
      
      menu.appendChild(item);
    });
    
    // Posiciona o menu
    const rect = this.enhanceButton.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    menu.style.left = `${rect.left - 150 + scrollLeft}px`;
    menu.style.top = `${rect.bottom + 5 + scrollTop}px`;
    
    // Ajusta posição se sair da tela
    document.body.appendChild(menu);
    const menuRect = menu.getBoundingClientRect();
    
    if (menuRect.right > window.innerWidth) {
      menu.style.left = `${rect.right - menuRect.width + scrollLeft}px`;
    }
    
    if (menuRect.bottom > window.innerHeight) {
      menu.style.top = `${rect.top - menuRect.height - 5 + scrollTop}px`;
    }
    
    // Remove menu ao clicar fora
    setTimeout(() => {
      document.addEventListener('click', function removeMenu(e) {
        if (!menu.contains(e.target) && !e.target.closest('.promptcraft-enhance-btn')) {
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
    const ariaLabel = (field.getAttribute('aria-label') || '').toLowerCase();
    
    // Detecta contexto baseado em atributos do campo
    if (fieldType === 'email' || 
        fieldName.includes('email') || 
        fieldId.includes('email') ||
        placeholder.includes('email')) {
      return 'email';
    }
    
    if (fieldName.includes('comment') || 
        fieldId.includes('comment') || 
        placeholder.includes('comment') ||
        ariaLabel.includes('comment')) {
      return 'comment';
    }
    
    if (fieldName.includes('message') || 
        fieldId.includes('message') || 
        placeholder.includes('message') ||
        fieldClass.includes('message')) {
      return 'message';
    }
    
    if (fieldClass.includes('social') || 
        fieldClass.includes('post') || 
        fieldClass.includes('tweet') ||
        fieldClass.includes('status')) {
      return 'social';
    }
    
    if (fieldClass.includes('code') || 
        fieldClass.includes('technical') ||
        fieldName.includes('code')) {
      return 'technical';
    }
    
    // Detecta baseado no contexto da página
    const url = window.location.href.toLowerCase();
    const hostname = window.location.hostname.toLowerCase();
    
    if (hostname.includes('linkedin') || 
        hostname.includes('twitter') || 
        hostname.includes('facebook') ||
        hostname.includes('instagram')) {
      return 'social';
    }
    
    if (hostname.includes('github') || 
        hostname.includes('stackoverflow') ||
        hostname.includes('codepen')) {
      return 'technical';
    }
    
    if (hostname.includes('gmail') || 
        hostname.includes('outlook') || 
        hostname.includes('mail') ||
        url.includes('compose')) {
      return 'email';
    }
    
    if (hostname.includes('docs.google') ||
        hostname.includes('notion') ||
        hostname.includes('confluence')) {
      return 'formal';
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
      field.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      field.value = text;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    // Foca no final do texto
    if (field.setSelectionRange) {
      field.setSelectionRange(text.length, text.length);
    }
  }
  
  async enhanceText(text, context, style) {
    this.enhanceButton.classList.add('loading');
    this.showTooltip('Aprimorando texto...', 0);
    
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
      
      // Adiciona efeito visual de sucesso
      this.currentField.classList.add('promptcraft-enhanced');
      this.enhanceButton.classList.add('success');
      
      setTimeout(() => {
        this.currentField.classList.remove('promptcraft-enhanced');
        this.enhanceButton.classList.remove('success');
      }, 2000);
      
      this.showTooltip('Texto aprimorado! ✨', 2000);
      
      // Atualiza estatísticas
      this.updateUsageStats();
      
    } catch (error) {
      console.error('Erro ao aprimorar texto:', error);
      this.showTooltip('Erro: ' + error.message, 3000);
    } finally {
      this.enhanceButton.classList.remove('loading');
    }
  }
  
  updateUsageStats() {
    chrome.storage.local.get(['dailyCount', 'totalCount'], (result) => {
      const newDailyCount = (result.dailyCount || 0) + 1;
      const newTotalCount = (result.totalCount || 0) + 1;
      
      chrome.storage.local.set({
        dailyCount: newDailyCount,
        totalCount: newTotalCount
      });
    });
  }
  
  showTooltip(text, duration = 1000) {
    if (!this.tooltip) {
      this.tooltip = document.createElement('div');
      this.tooltip.className = 'promptcraft-tooltip';
      document.body.appendChild(this.tooltip);
    }
    
    this.tooltip.textContent = text;
    
    const rect = this.enhanceButton.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    this.tooltip.style.left = `${rect.left + rect.width / 2 + scrollLeft}px`;
    this.tooltip.style.top = `${rect.top - 40 + scrollTop}px`;
    this.tooltip.style.transform = 'translateX(-50%)';
    
    this.tooltip.classList.add('show');
    
    if (duration > 0) {
      clearTimeout(this.tooltipTimeout);
      this.tooltipTimeout = setTimeout(() => {
        this.hideTooltip();
      }, duration);
    }
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