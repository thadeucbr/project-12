import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { routes } from './routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { loggingMiddleware } from './middlewares/logging.middleware';
import { rateLimitMiddleware } from './middlewares/rateLimit.middleware';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);
app.use(rateLimitMiddleware);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

app.use(errorMiddleware);
