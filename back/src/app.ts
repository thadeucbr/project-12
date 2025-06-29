import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { routes } from './routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { loggingMiddleware } from './middlewares/logging.middleware';
import { rateLimitMiddleware } from './middlewares/rateLimit.middleware';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { env } from './config/env';
import { IncomingMessage } from 'http';

export const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", env.CORS_ORIGINS.join(' ')],
    },
  },
}));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || env.CORS_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: env.CORS_METHODS,
  allowedHeaders: `${env.CORS_HEADERS},x-signature,x-timestamp`, // Inclua os cabeçalhos personalizados
  credentials: true, // Permite envio de cookies, se necessário
}));
app.use(express.json());
app.use(loggingMiddleware);
app.use(rateLimitMiddleware);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    deepLinking: true, // Habilita deep linking
    displayOperationId: true, // Mostra IDs das operações
    defaultModelsExpandDepth: -1, // Evita expandir modelos por padrão
    requestInterceptor: (req: IncomingMessage) => {
      const timestamp = new Date().toISOString();
      const payload = `${req.method}:${req.url}:${timestamp}`;
      const signature = require('crypto')
        .createHmac('sha256', env.PRIVATE_KEY)
        .update(payload)
        .digest('hex');

      req.headers['x-signature'] = signature;
      req.headers['x-timestamp'] = timestamp;
      return req;
    },
  },
}));
app.use('/api', routes);

app.use(errorMiddleware);
