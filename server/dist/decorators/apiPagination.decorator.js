"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPagination = ApiPagination;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function ApiPagination() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiQuery)({ name: 'page', required: false }), (0, swagger_1.ApiQuery)({ name: 'perPage', required: false }));
}
//# sourceMappingURL=apiPagination.decorator.js.map