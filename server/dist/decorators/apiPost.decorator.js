"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPost = ApiPost;
const common_1 = require("@nestjs/common");
const apiResponseMessage_decorator_1 = require("./apiResponseMessage.decorator");
function ApiPost(opt) {
    return (0, common_1.applyDecorators)((0, common_1.HttpCode)(opt?.code ?? 200), (0, common_1.Post)(opt.path), (0, apiResponseMessage_decorator_1.ResponseMessage)(opt?.responseMessage ?? 'success'));
}
//# sourceMappingURL=apiPost.decorator.js.map