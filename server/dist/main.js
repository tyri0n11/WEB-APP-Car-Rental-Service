"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const morgan = require("morgan");
const nest_winston_1 = require("nest-winston");
const apiDoc_config_1 = require("./configs/apiDoc.config");
const winston_config_1 = require("./configs/winston.config");
async function bootstrap() {
    const logger = new common_1.Logger(bootstrap.name);
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
        logger: nest_winston_1.WinstonModule.createLogger({
            instance: winston_config_1.default,
        }),
    });
    (0, apiDoc_config_1.configSwagger)(app);
    const configService = app.get(config_1.ConfigService);
    app.use(morgan('dev'));
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
        exceptionFactory: (errors) => {
            const result = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            return new common_1.BadRequestException(result);
        },
    }));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    await app.listen(configService.get('PORT'), () => {
        logger.log(`Server running on http://localhost:${configService.get('PORT')}`);
        logger.log(`API Docs http://localhost:${configService.get('PORT')}/api-docs`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map