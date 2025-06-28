# PromptCraft Text Enhancer - Extensão Chrome

Uma extensão do Chrome que adiciona funcionalidade de aprimoramento de texto inteligente em qualquer campo de texto na web, com onboarding completo e configuração simplificada.

## 🚀 Funcionalidades

### ✨ Onboarding Completo
- **Guia Passo a Passo**: Configuração guiada para usuários não técnicos
- **Múltiplos Provedores**: OpenAI, Google Gemini, Ollama (local)
- **Instruções Detalhadas**: Como obter chaves de API com links diretos
- **Seleção de Modelos**: Lista automática de modelos disponíveis
- **Configuração Visual**: Interface intuitiva e amigável

### 🤖 Provedores de IA Suportados

#### OpenAI
- **Modelos**: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo
- **Configuração**: Chave da API da OpenAI
- **Custo**: ~$0.002/1K tokens
- **Qualidade**: Excelente para todos os tipos de texto

#### Google Gemini
- **Modelos**: Gemini Pro, Gemini Pro Vision
- **Configuração**: Chave da API do Google AI Studio
- **Custo**: Gratuito até 60 requisições/minuto
- **Qualidade**: Muito boa, especialmente para textos criativos

#### Ollama (Local)
- **Modelos**: Llama 2, Mistral, Code Llama, Neural Chat
- **Configuração**: Instalação local do Ollama
- **Custo**: 100% gratuito
- **Privacidade**: Dados ficam no seu computador

### 🎯 Estilos de Aprimoramento

#### ✨ Profissional
- Tom formal e claro
- Ideal para emails corporativos
- Melhora profissionalismo

#### 😊 Casual
- Tom amigável e descontraído
- Perfeito para mensagens pessoais
- Mantém naturalidade

#### 🎨 Criativo
- Linguagem expressiva
- Ótimo para posts criativos
- Adiciona personalidade

#### ⚡ Conciso
- Direto ao ponto
- Remove redundâncias
- Maximiza clareza

#### 📝 Detalhado
- Expande com mais informações
- Adiciona contexto útil
- Melhora completude

### 🔍 Detecção Automática de Contexto

A extensão detecta automaticamente o contexto baseado em:
- **Tipo do campo**: email, textarea, contenteditable
- **Atributos HTML**: name, id, class, placeholder, aria-label
- **URL do site**: Gmail, LinkedIn, Twitter, GitHub, etc.
- **Estrutura da página**: formulários, comentários, posts

## 📦 Instalação e Configuração

### 1. Instalação da Extensão

1. **Baixe os arquivos** da extensão
2. **Abra** `chrome://extensions/`
3. **Ative** "Modo do desenvolvedor"
4. **Clique** "Carregar sem compactação"
5. **Selecione** a pasta `extension`

### 2. Onboarding Automático

Ao instalar, a extensão abrirá automaticamente o onboarding que te guiará através de:

#### Passo 1: Escolha do Provedor
- Selecione entre OpenAI, Gemini ou Ollama
- Veja comparação de custos e características
- Entenda as diferenças entre cada opção

#### Passo 2: Obtenção da Chave da API

**Para OpenAI:**
1. Acesse [platform.openai.com](https://platform.openai.com/signup)
2. Crie uma conta ou faça login
3. Vá para [API Keys](https://platform.openai.com/api-keys)
4. Clique em "Create new secret key"
5. Copie a chave (começa com "sk-")

**Para Google Gemini:**
1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Selecione um projeto ou crie um novo
5. Copie a chave gerada

**Para Ollama:**
1. Baixe em [ollama.ai](https://ollama.ai)
2. Instale no seu computador
3. Execute: `ollama pull llama2`
4. Execute: `ollama serve`

#### Passo 3: Seleção do Modelo
- A extensão carrega automaticamente os modelos disponíveis
- Escolha o modelo que melhor atende suas necessidades
- Veja descrições e recomendações para cada modelo

#### Passo 4: Configurações Finais
- Defina o estilo padrão de aprimoramento
- Configure preferências de uso
- Entenda como usar a extensão

### 3. Configuração Manual (Opcional)

Você pode reconfigurar a extensão a qualquer momento:

1. **Clique** no ícone da extensão
2. **Clique** em "Configurar"
3. **Altere** provedor, modelo ou configurações
4. **Salve** as alterações

## 🎮 Como Usar

### Uso Básico
1. **Navegue** para qualquer site com campos de texto
2. **Clique** em um campo de texto
3. **Digite** seu texto
4. **Clique** no ícone ✨ que aparece
5. **Escolha** o estilo de aprimoramento
6. **Aguarde** o texto ser aprimorado

### Dicas de Uso
- **Texto mínimo**: 10 caracteres para aprimoramento
- **Contexto automático**: A extensão detecta o tipo de campo
- **Estilo padrão**: Use o configurado ou escolha outro
- **Feedback visual**: Veja animações de sucesso/erro

## ⚙️ Configurações Avançadas

### Interface do Popup
- **Status da extensão**: Verde (ativo), vermelho (inativo), amarelo (configuração pendente)
- **Informações do provedor**: Modelo atual e custos
- **Estatísticas de uso**: Contadores diário e total
- **Ações rápidas**: Ativar/desativar, testar, configurar

### Configurações Disponíveis
- **Provedor de IA**: OpenAI, Gemini, Ollama
- **Modelo específico**: Lista dinâmica baseada no provedor
- **Estilo padrão**: Profissional, casual, criativo, conciso, detalhado
- **Detecção automática**: Ativa/desativa detecção de contexto
- **Notificações**: Feedback visual de ações

## 🔒 Segurança e Privacidade

### Armazenamento de Dados
- **Configurações**: Armazenadas localmente no Chrome
- **Chaves de API**: Criptografadas no armazenamento local
- **Texto processado**: Enviado apenas quando solicitado
- **Histórico**: Não armazenamos conteúdo dos campos

### Comunicação com APIs
- **OpenAI**: Comunicação direta via HTTPS
- **Gemini**: Comunicação direta via HTTPS
- **Ollama**: Comunicação local (localhost)

### Permissões
- **activeTab**: Para funcionar na aba atual
- **storage**: Para salvar configurações
- **scripting**: Para injetar funcionalidade
- **host_permissions**: Para acessar APIs externas

## 🛠️ Desenvolvimento

### Estrutura do Projeto
```
extension/
├── manifest.json          # Configuração da extensão
├── background.js          # Service worker (API calls)
├── content.js            # Script injetado (UI)
├── content.css           # Estilos visuais
├── popup.html            # Interface do popup
├── popup.js              # Lógica do popup
├── onboarding.html       # Interface de onboarding
├── onboarding.js         # Lógica do onboarding
├── icons/                # Ícones da extensão
└── README.md            # Documentação
```

### APIs Utilizadas
- **Chrome Extensions API**: Funcionalidades da extensão
- **Chrome Storage API**: Armazenamento de configurações
- **Chrome Tabs API**: Abertura de abas
- **OpenAI API**: Processamento de texto
- **Google Gemini API**: Processamento de texto
- **Ollama API**: Processamento local

## 🐛 Solução de Problemas

### Problemas Comuns

#### "Configure sua API primeiro"
- Verifique se inseriu a chave da API corretamente
- Confirme se o provedor está selecionado
- Para Ollama, certifique-se de que está rodando

#### "Erro na API"
- **OpenAI**: Verifique se tem créditos na conta
- **Gemini**: Confirme se não excedeu o limite gratuito
- **Ollama**: Verifique se o serviço está rodando

#### Botão não aparece
- Campos muito pequenos são ignorados
- Campos de senha são ignorados por segurança
- Recarregue a página após instalar

#### Texto não é aprimorado
- Texto deve ter pelo menos 10 caracteres
- Verifique conexão com internet (OpenAI/Gemini)
- Veja logs no console (F12)

### Debug Avançado
1. Abra `chrome://extensions/`
2. Clique em "Detalhes" na extensão
3. Clique em "Inspecionar visualizações: service worker"
4. Verifique logs de erro no console

## 📊 Estatísticas de Uso

A extensão mantém estatísticas locais:
- **Contador diário**: Reset automático à meia-noite
- **Contador total**: Acumulativo desde a instalação
- **Não enviamos dados**: Tudo fica no seu navegador

## 🔄 Atualizações

### v1.0.0 - Lançamento Inicial
- Onboarding completo para usuários não técnicos
- Suporte a OpenAI, Gemini e Ollama
- Detecção automática de contexto
- 5 estilos de aprimoramento
- Interface moderna e intuitiva
- Estatísticas de uso
- Configuração simplificada

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

## 🔗 Links Úteis

- [Documentação Chrome Extensions](https://developer.chrome.com/docs/extensions/)
- [OpenAI API](https://platform.openai.com/docs)
- [Google Gemini API](https://ai.google.dev/)
- [Ollama](https://ollama.ai/)
- [Reportar Bug](https://github.com/your-repo/issues)

---

**Desenvolvido com ❤️ para melhorar sua escrita na web!**