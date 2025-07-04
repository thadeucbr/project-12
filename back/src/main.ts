import { app } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { connectDB } from './config/database';

connectDB();

const port = env.PORT || 3000;

app.listen(port, () => {
  logger.info(`API running on port ${port}`);
});
