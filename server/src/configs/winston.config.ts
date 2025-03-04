import { createLogger, format, transports } from 'winston';
import * as path from 'path';
import * as fs from 'fs';
import 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFormat = format.combine(
  format.timestamp({ format: 'DD/MM/YY HH:mm:ss' }),
  format.ms(),
  nestWinstonModuleUtilities.format.nestLike('CAR-RENTAL', {
    colors: true,
    prettyPrint: true,
  }),
);

const logger = createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new transports.Console({
      format: logFormat,
    }),
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    new transports.DailyRotateFile({
      filename: path.join(logDir, 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      maxSize: '20m',
    }),
  ],
});

export default logger;
