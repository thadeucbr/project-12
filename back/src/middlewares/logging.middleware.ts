import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  // logger.info({
  //   method: req.method,
  //   url: req.originalUrl,
  //   ip: req.ip,
  //   headers: { ...req.headers, authorization: undefined, 'x-api-key': undefined },
  //   timestamp: new Date().toISOString(),
  // });
  next();
}
