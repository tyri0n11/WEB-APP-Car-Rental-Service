"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const path = require("path");
const fs = require("fs");
require("winston-daily-rotate-file");
const nest_winston_1 = require("nest-winston");
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const logFormat = winston_1.format.combine(winston_1.format.timestamp({ format: 'DD/MM/YY HH:mm:ss' }), winston_1.format.ms(), nest_winston_1.utilities.format.nestLike('CAR-RENTAL', {
    colors: true,
    prettyPrint: true,
}));
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: logFormat,
    transports: [
        new winston_1.transports.Console({
            format: logFormat,
        }),
        new winston_1.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
        }),
        new winston_1.transports.DailyRotateFile({
            filename: path.join(logDir, 'app-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            maxSize: '20m',
        }),
    ],
});
exports.default = logger;
//# sourceMappingURL=winston.config.js.map