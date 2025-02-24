"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    constructor(configService) {
        this.configService = configService;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException ? exception.getStatus() : 500;
        const message = exception instanceof common_1.HttpException
            ? exception.message
            : 'Internal server error';
        common_1.Logger.error({
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            statusCode: status,
            message: exception instanceof Error
                ? exception.message
                : typeof message === 'string'
                    ? message
                    : JSON.stringify(message),
            stack: exception instanceof Error ? exception.stack : null,
        });
        console.error(exception);
        response.status(status).json({
            statusCode: status,
            message,
            error: this.configService.get('NODE_ENV') !== 'production'
                ? {
                    response: exception.response,
                    stack: exception.stack,
                }
                : null,
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GlobalExceptionFilter);
//# sourceMappingURL=globalException.filter.js.map