# PromptCraft - AI Prompt Enhancement Tool

## Descrição do Projeto

O **PromptCraft** é uma aplicação completa que transforma prompts simples em instruções poderosas e otimizadas para modelos de linguagem (LLMs - Large Language Models). Ele utiliza uma combinação de lógica local e integração com APIs externas para aprimorar prompts, tornando-os mais claros, eficazes e prontos para uso em aplicações de IA.

O projeto é dividido em duas partes principais:

- **Front-end**: Uma interface de usuário moderna e interativa para criar, aprimorar e gerenciar prompts.
- **Back-end**: Uma API robusta que processa os prompts e se comunica com provedores de LLM, como OpenAI, Gemini, Claude, entre outros.

---

## Estrutura do Projeto

### `/front`

O diretório `front` contém o código do **front-end** da aplicação, desenvolvido em **React** com **TypeScript** e estilizado com **Tailwind CSS**. Ele oferece uma interface amigável para os usuários interagirem com o sistema.

#### Principais Funcionalidades:
- **Entrada de Prompt**: Permite que os usuários insiram prompts para aprimoramento.
- **Histórico de Prompts**: Gerencia e exibe o histórico de prompts aprimorados.
- **Aprimoramento Inteligente**: Integração com o back-end para aprimorar prompts usando provedores de LLM.
- **Fallback Local**: Caso a API falhe, utiliza uma lógica local para aprimorar os prompts.
- **Atalhos de Teclado**: Acelera ações como copiar, limpar e alternar temas.
- **Modo Escuro**: Suporte a temas claro e escuro.

#### Tecnologias Utilizadas:
- **React** e **TypeScript**: Para construção da interface.
- **Tailwind CSS**: Para estilização.
- **Framer Motion**: Para animações.
- **Lucide React**: Para ícones.
- **Vite**: Para desenvolvimento e build.

#### Como Executar:
1. Navegue até o diretório `/front`.
2. Crie o arquivo `.env` a partir do `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse a aplicação no navegador em `http://localhost:5173`.

---

### `/back`

O diretório `back` contém o código do **back-end**, desenvolvido em **Node.js** com **TypeScript** e utilizando o framework **Express**. Ele fornece uma API para processar prompts e se comunicar com provedores de LLM.

#### Principais Funcionalidades:
- **Autenticação e Assinatura**: Valida requisições usando chaves de API e assinaturas HMAC.
- **Integração com Provedores de LLM**: Suporte a OpenAI, Gemini, Claude e Ollama.
- **Rate Limiting**: Limita o número de requisições para evitar abusos.
- **Swagger**: Documentação interativa da API.
- **Middleware de Erros**: Gerencia erros de forma centralizada.

#### Tecnologias Utilizadas:
- **Express**: Para criação da API.
- **Class-Transformer** e **Class-Validator**: Para validação de dados.
- **Swagger**: Para documentação da API.
- **Helmet** e **CORS**: Para segurança.
- **Winston**: Para logging.

#### Como Executar:
1. Navegue até o diretório `/back`.
2. Crie o arquivo `.env` a partir do `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Configure as variáveis de ambiente no arquivo `.env`.
5. Inicie o servidor:
   ```bash
   npm run dev
   ```
6. A API estará disponível em `http://localhost:3000`.

---

## Como Funciona

1. O usuário insere um prompt no front-end.
2. O front-end envia o prompt para o back-end via API.
3. O back-end processa o prompt, utilizando provedores de LLM ou lógica local.
4. O resultado é retornado ao front-end e exibido ao usuário.
5. O histórico de prompts é salvo localmente no navegador.

---

## Requisitos

- **Node.js**: Versão 16 ou superior.
- **NPM**: Versão 7 ou superior.
- **Ambiente de Desenvolvimento**:
  - Front-end: Navegador moderno.
  - Back-end: Servidor local ou em nuvem.

---

## Documentação da API

A documentação da API está disponível em `/api/docs` quando o servidor do back-end está em execução. Ela inclui detalhes sobre os endpoints, parâmetros e exemplos de requisições.

---

## Contribuição

Contribuições são bem-vindas! Siga os passos abaixo para contribuir:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature ou correção:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça as alterações e commit:
   ```bash
   git commit -m "Descrição da minha feature"
   ```
4. Envie sua branch:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request.

---

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais informações.
