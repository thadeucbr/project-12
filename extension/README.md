# PromptCraft Text Enhancer - Extensão Chrome

Uma extensão do Chrome que adiciona funcionalidade de aprimoramento de texto inteligente em qualquer campo de texto na web.

## 🚀 Funcionalidades

### ✨ Aprimoramento Inteligente de Texto
- **Detecção Automática**: Identifica automaticamente o contexto (email, redes sociais, comentários, etc.)
- **Múltiplos Estilos**: Profissional, Casual, Criativo, Conciso, Detalhado
- **Melhoria Contextual**: Adapta o aprimoramento baseado no tipo de campo e site

### 🎯 Contextos Suportados
- **Email**: Tom profissional e claro
- **Redes Sociais**: Envolvente e conciso
- **Comentários**: Respeitoso e construtivo
- **Documentos Formais**: Linguagem profissional
- **Textos Criativos**: Expressivo e envolvente
- **Documentação Técnica**: Claro e preciso

### 🔧 Configurações Avançadas
- Configuração de API personalizada
- Detecção automática de contexto
- Estilos de aprimoramento personalizáveis
- Notificações opcionais

## 📦 Instalação

### Desenvolvimento Local

1. **Clone o repositório**:
   ```bash
   git clone <repository-url>
   cd extension
   ```

2. **Configure a API**:
   - Certifique-se de que o backend está rodando em `http://localhost:3000`
   - Obtenha suas chaves de API (API Key e Private Key)

3. **Carregue a extensão no Chrome**:
   - Abra `chrome://extensions/`
   - Ative o "Modo do desenvolvedor"
   - Clique em "Carregar sem compactação"
   - Selecione a pasta `extension`

4. **Configure a extensão**:
   - Clique no ícone da extensão na barra de ferramentas
   - Insira suas credenciais da API
   - Salve as configurações

## 🎮 Como Usar

### Uso Básico
1. **Navegue para qualquer site** com campos de texto
2. **Clique em um campo de texto** (textarea, input, contenteditable)
3. **Digite seu texto**
4. **Clique no ícone ✨** que aparece no canto do campo
5. **Escolha o estilo** de aprimoramento desejado
6. **Aguarde** o texto ser aprimorado automaticamente

### Estilos Disponíveis

#### ✨ Profissional
- Tom formal e claro
- Ideal para emails corporativos e documentos
- Melhora clareza e profissionalismo

#### 😊 Casual
- Tom amigável e descontraído
- Perfeito para mensagens pessoais
- Mantém naturalidade

#### 🎨 Criativo
- Linguagem expressiva e envolvente
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

### Detecção Automática de Contexto

A extensão detecta automaticamente o contexto baseado em:
- **Tipo do campo**: email, textarea, contenteditable
- **Atributos HTML**: name, id, class, placeholder
- **URL do site**: Gmail, LinkedIn, Twitter, GitHub, etc.
- **Estrutura da página**: formulários, comentários, posts

## ⚙️ Configuração

### Configurações Básicas
- **URL da API**: Endereço do backend (padrão: `http://localhost:3000/api`)
- **Chave da API**: Sua chave de autenticação
- **Chave Privada**: Chave para assinatura de requisições
- **Estilo Padrão**: Estilo usado por padrão

### Configurações Avançadas
- **Detecção Automática**: Ativa/desativa detecção de contexto
- **Notificações**: Mostra feedback visual
- **Sites Específicos**: Configurações por domínio

## 🔒 Segurança

### Autenticação
- Usa sistema de assinatura HMAC-SHA256
- Chaves armazenadas localmente no Chrome
- Comunicação segura com o backend

### Privacidade
- Texto processado apenas quando solicitado
- Não armazena conteúdo dos campos
- Configurações sincronizadas com conta do Chrome

## 🛠️ Desenvolvimento

### Estrutura do Projeto
```
extension/
├── manifest.json          # Configuração da extensão
├── background.js          # Service worker
├── content.js            # Script injetado nas páginas
├── content.css           # Estilos do content script
├── popup.html            # Interface do popup
├── popup.js              # Lógica do popup
├── icons/                # Ícones da extensão
└── README.md            # Documentação
```

### APIs Utilizadas
- **Chrome Extensions API**: Funcionalidades da extensão
- **Chrome Storage API**: Armazenamento de configurações
- **Chrome Tabs API**: Abertura de abas
- **Web Crypto API**: Geração de assinaturas

### Compatibilidade
- **Chrome**: Versão 88+
- **Edge**: Versão 88+
- **Outros navegadores Chromium**: Suporte experimental

## 🐛 Solução de Problemas

### Problemas Comuns

#### Extensão não aparece
- Verifique se está ativada em `chrome://extensions/`
- Recarregue a página após instalar
- Verifique permissões da extensão

#### Botão não aparece nos campos
- Campos muito pequenos são ignorados
- Campos de senha são ignorados por segurança
- Verifique se a extensão está ativada

#### Erro de API
- Verifique se o backend está rodando
- Confirme as credenciais da API
- Verifique conectividade de rede

#### Texto não é aprimorado
- Verifique configurações da API
- Teste com texto mais longo
- Verifique logs do console (F12)

### Debug
1. Abra `chrome://extensions/`
2. Clique em "Detalhes" na extensão
3. Clique em "Inspecionar visualizações: service worker"
4. Verifique logs de erro

## 📝 Changelog

### v1.0.0
- Lançamento inicial
- Suporte a múltiplos estilos de aprimoramento
- Detecção automática de contexto
- Interface de configuração completa
- Integração com backend PromptCraft

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 🔗 Links Úteis

- [Documentação Chrome Extensions](https://developer.chrome.com/docs/extensions/)
- [Backend PromptCraft](../back/README.md)
- [Frontend PromptCraft](../front/README.md)
- [Reportar Bug](https://github.com/your-repo/issues)