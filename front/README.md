# Front-End do PromptCraft

Bem-vindo ao projeto **Front-End do PromptCraft**! Este aplicativo foi projetado para aprimorar prompts de usuários em instruções poderosas para modelos de IA. Ele utiliza tecnologias modernas como React, TypeScript, Tailwind CSS e Vite para uma experiência de desenvolvimento fluida.

---

## Índice

1. [Introdução](#introdução)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Variáveis de Ambiente](#variáveis-de-ambiente)
4. [Scripts Disponíveis](#scripts-disponíveis)
5. [Tecnologias Utilizadas](#tecnologias-utilizadas)

---

## Introdução

### Pré-requisitos

Certifique-se de ter os seguintes itens instalados no seu sistema:

- [Node.js](https://nodejs.org/) (v16 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Instalação

1. Clone o repositório:
   ```bash
   git clone <repository-url>
   cd front
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` no diretório raiz copiando o `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Atualize o arquivo `.env` com suas credenciais da API (veja [Variáveis de Ambiente](#variáveis-de-ambiente)).

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

6. Abra o navegador e acesse `http://localhost:8090`.

---

## Estrutura do Projeto

```
front/
├── src/                # Código-fonte da aplicação
│   ├── components/     # Componentes reutilizáveis do React
│   ├── contexts/       # Provedores de contexto do React
│   ├── hooks/          # Hooks personalizados do React
│   ├── services/       # Lógica de serviços da API
│   ├── utils/          # Funções utilitárias
│   ├── types/          # Definições de tipos do TypeScript
│   ├── App.tsx         # Componente principal da aplicação
│   ├── main.tsx        # Ponto de entrada da aplicação
│   └── index.css       # Estilos globais
├── public/             # Arquivos estáticos
├── .env.example        # Exemplo de variáveis de ambiente
├── package.json        # Metadados do projeto e scripts
├── tailwind.config.js  # Configuração do Tailwind CSS
├── vite.config.ts      # Configuração do Vite
└── README.md           # Documentação do projeto
```

---

## Variáveis de Ambiente

O arquivo `.env` é usado para configurar a aplicação. Abaixo está uma explicação detalhada de cada variável:

### `VITE_API_BASE_URL`
- **Descrição**: A URL base para a API do backend.
- **Exemplo**: `http://localhost:3000/api`
- **Uso**: Utilizada para enviar requisições ao backend para aprimoramento de prompts.

### `VITE_API_KEY`
- **Descrição**: A chave da API para autenticar requisições ao backend.
- **Exemplo**: `sua-chave-segura-da-api`
- **Uso**: Essa chave é incluída nos cabeçalhos das requisições para verificar o cliente.

### `VITE_PRIVATE_KEY`
- **Descrição**: Uma chave privada usada para assinar requisições da API.
- **Exemplo**:
  ```
  -----BEGIN PRIVATE KEY-----
  MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDEqZemeXdkrdJ9
  ...
  -----END PRIVATE KEY-----
  ```
- **Uso**: Essa chave é usada para gerar assinaturas HMAC para comunicação segura com o backend.

---

## Scripts Disponíveis

### `npm run dev`
Inicia o servidor de desenvolvimento em `http://localhost:8090`.

### `npm run build`
Compila a aplicação para produção. A saída é armazenada no diretório `dist/`.

### `npm run preview`
Visualiza a compilação de produção localmente.

### `npm run lint`
Executa o ESLint para verificar problemas de qualidade do código.

---

## Tecnologias Utilizadas

- **React**: Uma biblioteca JavaScript para construir interfaces de usuário.
- **TypeScript**: Uma linguagem de programação fortemente tipada que expande o JavaScript.
- **Vite**: Uma ferramenta de build rápida e servidor de desenvolvimento.
- **Tailwind CSS**: Um framework CSS baseado em utilitários.
- **Framer Motion**: Uma biblioteca para animações e gestos.
- **Lucide React**: Uma coleção de ícones bonitos e personalizáveis.

---

## Contribuindo

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do repositório.
2. Crie um novo branch para sua funcionalidade ou correção de bug.
3. Faça commit das suas alterações e envie o branch.
4. Abra um pull request.

---

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

---

## Contato

Para dúvidas ou suporte, entre em contato com o mantenedor do projeto.
