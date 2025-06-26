import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT,
  API_KEYS: (process.env.API_KEYS || '').split(',').map(k => k.trim()),
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 60,
  LLM_PROVIDERS: (process.env.LLM_PROVIDERS || '').split(',').map(p => p.trim()),

  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
  OPENAI_MODEL: process.env.OPENAI_MODEL,

  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_BASE_URL: process.env.GEMINI_BASE_URL,
  GEMINI_MODEL: process.env.GEMINI_MODEL,

  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
  CLAUDE_BASE_URL: process.env.CLAUDE_BASE_URL,
  CLAUDE_MODEL: process.env.CLAUDE_MODEL,

  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
  OLLAMA_MODEL: process.env.OLLAMA_MODEL,

  CORS_ORIGINS: (process.env.CORS_ORIGINS || '').split(',').map(origin => origin.trim()),
  CORS_METHODS: process.env.CORS_METHODS || 'GET,POST,PUT,DELETE',
  CORS_HEADERS: process.env.CORS_HEADERS || 'Content-Type,Authorization,x-api-key',

  PRIVATE_KEY: process.env.PRIVATE_KEY || '',
};
