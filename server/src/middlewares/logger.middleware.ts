// src/middleware/logger.middleware.ts
import winstonInstance from '@/configs/winston.config';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const start = process.hrtime();

    // Add response tracking
    const originalSend = res.send;
    let responseBody: any;

    res.send = function (body) {
      responseBody = body;
      return originalSend.call(this, body);
    };

    res.on('finish', () => {
      const diff = process.hrtime(start);
      const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3); // More precise timing
      const contentLength =
        res.get('content-length') || (responseBody ? responseBody.length : 0);

      winstonInstance.log({
        level: res.statusCode >= 400 ? 'error' : 'info',
        message: `${method} ${originalUrl} ${res.statusCode} - ${responseTime}ms - ${contentLength}`,
        context: 'HTTP',
        ip,
      });
    });
    next();
  }
}
