import { app } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { connectDB } from './config/database';
import cookieParser from 'cookie-parser';

connectDB();

app.use(cookieParser(process.env.COOKIE_SECRET));

const port = env.PORT || 3000;

app.listen(port, () => {
  logger.info(`API running on port ${port}`);
});
