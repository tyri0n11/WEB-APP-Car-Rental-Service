"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoApplyResInterceptor = exports.NO_APPLY_RES_INTERCEPTOR = exports.ResponseMessage = void 0;
const common_1 = require("@nestjs/common");
const ResponseMessage = (message) => (0, common_1.SetMetadata)('response_message', message);
exports.ResponseMessage = ResponseMessage;
exports.NO_APPLY_RES_INTERCEPTOR = 'no_res_interceptor';
const NoApplyResInterceptor = () => (0, common_1.SetMetadata)(exports.NO_APPLY_RES_INTERCEPTOR, true);
exports.NoApplyResInterceptor = NoApplyResInterceptor;
//# sourceMappingURL=apiResponseMessage.decorator.js.map