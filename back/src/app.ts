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

export const app = express();

app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGINS,
  methods: env.CORS_METHODS,
  allowedHeaders: env.CORS_HEADERS,
}));
app.use(express.json());
app.use(loggingMiddleware);
app.use(rateLimitMiddleware);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

app.use(errorMiddleware);
