# Backend LLM

Este projeto é um serviço backend para integração com múltiplos provedores de Modelos de Linguagem de Grande Escala (LLM), como OpenAI, Gemini, Claude e Ollama. Ele fornece APIs para gerar respostas desses provedores e inclui recursos como autenticação, limitação de taxa, registro de logs e verificações de saúde.

## Índice
- [Introdução](#introdução)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Documentação da API](#documentação-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)

---

## Introdução

### Pré-requisitos
- Node.js (v16 ou superior)
- npm ou yarn
- Um arquivo `.env` com as variáveis necessárias (veja [Variáveis de Ambiente](#variáveis-de-ambiente)).

### Instalação
1. Clone o repositório:
   ```bash
   git clone <repository-url>
   cd back
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Atualize o arquivo `.env` com sua configuração.

5. Compile o projeto:
   ```bash
   npm run build
   ```

6. Inicie o servidor:
   ```bash
   npm start
   ```

---

## Variáveis de Ambiente

A aplicação utiliza um arquivo `.env` para configurar seu comportamento. Abaixo está uma explicação detalhada de cada variável:

### Configuração Geral
- **`PORT`**: A porta na qual o servidor será executado (ex.: `3000`).
- **`API_KEYS`**: Uma lista separada por vírgulas de chaves de API para autenticar as requisições (ex.: `key1,key2`).

### Limitação de Taxa
- **`RATE_LIMIT_WINDOW_MS`**: A janela de tempo para limitação de taxa em milissegundos (ex.: `60000` para 1 minuto).
- **`RATE_LIMIT_MAX`**: O número máximo de requisições permitidas dentro da janela de tempo (ex.: `60`).

### Provedores LLM
- **`LLM_PROVIDERS`**: Uma lista separada por vírgulas de provedores LLM ativos (ex.: `openai,gemini,claude,ollama`).

#### OpenAI
- **`OPENAI_API_KEY`**: A chave de API para acessar os serviços da OpenAI.
- **`OPENAI_BASE_URL`**: A URL base para a API da OpenAI (ex.: `https://api.openai.com/v1`).
- **`OPENAI_MODEL`**: O modelo da OpenAI a ser utilizado (ex.: `gpt-3.5-turbo`).

#### Gemini
- **`GEMINI_API_KEY`**: A chave de API para acessar os serviços da Gemini.
- **`GEMINI_BASE_URL`**: A URL base para a API da Gemini (ex.: `https://generativelanguage.googleapis.com/v1beta`).
- **`GEMINI_MODEL`**: O modelo da Gemini a ser utilizado (ex.: `gemini-pro`).

#### Claude
- **`CLAUDE_API_KEY`**: A chave de API para acessar os serviços da Claude.
- **`CLAUDE_BASE_URL`**: A URL base para a API da Claude (ex.: `https://api.anthropic.com/v1`).
- **`CLAUDE_MODEL`**: O modelo da Claude a ser utilizado (ex.: `claude-3-opus-20240229`).

#### Ollama
- **`OLLAMA_BASE_URL`**: A URL base para a API da Ollama (ex.: `http://localhost:11434`).
- **`OLLAMA_MODEL`**: O modelo da Ollama a ser utilizado (ex.: `llama2`).

### Configuração de CORS
- **`CORS_ORIGINS`**: Uma lista separada por vírgulas de origens permitidas para CORS (ex.: `http://localhost:3000,http://localhost:8090`).
- **`CORS_METHODS`**: Métodos HTTP permitidos para CORS (ex.: `GET,POST,PUT,DELETE`).
- **`CORS_HEADERS`**: Cabeçalhos HTTP permitidos para CORS (ex.: `Content-Type,Authorization,x-api-key`).

### Assinatura de Requisições
- **`PUBLIC_KEY`**: A chave pública usada para verificar assinaturas de requisições.
- **`PRIVATE_KEY`**: A chave privada usada para assinar requisições.

---

## Scripts Disponíveis

- **`npm start`**: Inicia o servidor em modo de produção.
- **`npm run dev`**: Inicia o servidor em modo de desenvolvimento com hot-reloading.
- **`npm run build`**: Compila o código TypeScript para JavaScript.
- **`npm run lint`**: Executa o ESLint para verificar problemas de qualidade no código.

---

## Documentação da API

A API é documentada usando Swagger. Após iniciar o servidor, você pode acessar o Swagger UI em:
```
http://<host-do-servidor>:<porta>/api/docs
```

### Endpoints
- **`POST /llm`**: Gera uma resposta de um provedor LLM.
- **`GET /health`**: Realiza uma verificação de saúde da API e dos provedores LLM ativos.

---

## Como Usar a API

Para interagir com a API, você precisa primeiro obter um token de sessão e depois usá-lo para fazer requisições aos endpoints protegidos.

### Passo 1: Obter o Token de Sessão

Faça uma requisição `POST` para o endpoint `/api/session/token` para receber um cookie `HttpOnly` contendo o seu token de sessão.

**Endpoint:**
`POST /api/session/token`

**Exemplo com cURL:**
```bash
curl -X POST -c cookie.txt -v http://localhost:3000/api/session/token
```

O cookie `sessionToken` será usado automaticamente nas próximas requisições pelo seu cliente HTTP.

### Passo 2: Enviar um Prompt para o LLM

Com o token de sessão ativo, você pode fazer uma requisição `POST` para o endpoint `/api/llm` para gerar uma resposta de um provedor de LLM.

**Endpoint:**
`POST /api/llm`

**Corpo da Requisição:**
```json
{
  "prompt": "O seu prompt aqui.",
  "provider": "openai"
}
```

**Exemplo com cURL:**
```bash
curl -X POST \
  -b cookie.txt \
  -H "Content-Type: application/json" \
  -d '{
        "prompt": "Traduza a frase a seguir para o inglês: Onde fica a biblioteca mais próxima?",
        "provider": "openai"
      }' \
  http://localhost:3000/api/llm
```

A resposta conterá a saída do provedor LLM selecionado.

---

## Estrutura do Projeto


```
back/
├── src/
│   ├── app.ts               # Configuração principal da aplicação
│   ├── main.ts              # Ponto de entrada
│   ├── config/              # Arquivos de configuração (ex.: ambiente, Swagger)
│   ├── controllers/         # Controladores da API
│   ├── dtos/                # Objetos de Transferência de Dados
│   ├── middlewares/         # Middlewares do Express
│   ├── providers/           # Implementações dos provedores LLM
│   ├── routes/              # Rotas da API
│   ├── services/            # Serviços de lógica de negócios
│   ├── types/               # Definições de tipos TypeScript
│   ├── utils/               # Funções utilitárias
├── .env                     # Variáveis de ambiente
├── .env.example             # Exemplo de variáveis de ambiente
├── package.json             # Metadados e dependências do projeto
├── tsconfig.json            # Configuração do TypeScript
├── README.md                # Documentação do projeto
```

---

## Notas
- Certifique-se de que chaves sensíveis como `PRIVATE_KEY` e `API_KEYS` sejam mantidas seguras e não sejam compartilhadas publicamente.
- Para desenvolvimento local, você pode usar ferramentas como [Postman](https://www.postman.com/) ou [Swagger UI](https://swagger.io/tools/swagger-ui/) para testar a API.
