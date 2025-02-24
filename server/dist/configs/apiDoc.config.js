"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configSwagger = configSwagger;
const swagger_1 = require("@nestjs/swagger");
const swagger_themes_1 = require("swagger-themes");
function configSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Ticket Bottle')
        .setDescription('## Description')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    }, 'jwt')
        .addSecurityRequirements('jwt')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    const theme = new swagger_themes_1.SwaggerTheme();
    swagger_1.SwaggerModule.setup('api-docs', app, document, {
        swaggerOptions: { persistAuthorization: true },
        customCss: theme.getBuffer(swagger_themes_1.SwaggerThemeNameEnum.ONE_DARK),
    });
}
//# sourceMappingURL=apiDoc.config.js.map