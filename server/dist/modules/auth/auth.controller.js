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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("../user/user.service");
const auth_service_1 = require("./auth.service");
const forgotPassword_request_dto_1 = require("./dto/request/forgotPassword.request.dto");
const login_request_dto_1 = require("./dto/request/login.request.dto");
const signup_request_dto_1 = require("./dto/request/signup.request.dto");
const verifyAccount_request_dto_1 = require("./dto/request/verifyAccount.request.dto");
const login_response_dto_1 = require("./dto/response/login.response.dto");
const apiPost_decorator_1 = require("../../decorators/apiPost.decorator");
const local_guard_1 = require("./guards/local/local.guard");
const jwtAccess_guard_1 = require("./guards/jwt/jwtAccess.guard");
const response_dto_1 = require("../user/dto/response.dto");
const jwtRefresh_guard_1 = require("./guards/jwt/jwtRefresh.guard");
const refreshToken_request_dto_1 = require("./dto/request/refreshToken.request.dto");
const resetPassword_dto_1 = require("./dto/request/resetPassword.dto");
const sendVerifyEmail_request_dto_1 = require("./dto/request/sendVerifyEmail.request.dto");
let AuthController = class AuthController {
    constructor(authService, userService, configService) {
        this.authService = authService;
        this.userService = userService;
        this.configService = configService;
    }
    async signup(dto) {
        return await this.authService.signup(dto);
    }
    async login(request) {
        const { user } = request;
        return await this.authService.login(user.id);
    }
    async getMe(request) {
        const { user } = request;
        return await this.userService.findByEmail(user.email);
    }
    async refreshAccessToken(request) {
        const { user } = request;
        const accessToken = this.authService.generateAccessToken({
            userId: user.id,
        });
        return {
            accessToken,
        };
    }
    async resetPassword(dto) {
        return await this.authService.resetPassword(dto);
    }
    async verifyAccount(query) {
        return await this.authService.verifyAccount(query.token);
    }
    async forgotPassword(dto) {
        return await this.authService.forgotPassword(dto.email);
    }
    async sendEmailVerify(dto) {
        return await this.authService.sendVerificationEmail(dto.email);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, apiPost_decorator_1.ApiPost)({
        path: 'signup',
        responseMessage: 'User signed up successfully. Please check your email to verify your account',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_request_dto_1.SignupRequestDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, apiPost_decorator_1.ApiPost)({ path: 'login' }),
    (0, common_1.UseGuards)(local_guard_1.LocalUserAuthGuard),
    (0, swagger_1.ApiBody)({
        type: login_request_dto_1.LoginRequestDTO,
        examples: {
            user_1: {
                value: {
                    email: 'user6@example.com',
                    password: 'userPassword123!',
                },
            },
            user_2: {
                value: {
                    email: 'user2@example.com',
                    password: 'userPassword123!',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Login successful',
        type: login_response_dto_1.LoginResponseDTO,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwtAccess_guard_1.JwtAccessGuard),
    (0, apiPost_decorator_1.ApiPost)({ path: 'me' }),
    (0, swagger_1.ApiOkResponse)({ type: response_dto_1.UserResponseDTO }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.UseGuards)(jwtRefresh_guard_1.JwtRefreshGuard),
    (0, apiPost_decorator_1.ApiPost)({ path: 'refresh-token' }),
    (0, swagger_1.ApiBody)({
        type: refreshToken_request_dto_1.RefreshTokenRequestDTO,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshAccessToken", null);
__decorate([
    (0, apiPost_decorator_1.ApiPost)({ path: 'reset-password' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resetPassword_dto_1.ResetPasswordRequestDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, apiPost_decorator_1.ApiPost)({ path: 'verify-account' }),
    (0, swagger_1.ApiQuery)({
        name: 'token',
        required: true,
        type: String,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verifyAccount_request_dto_1.VerifyAccountRequestQuery]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyAccount", null);
__decorate([
    (0, apiPost_decorator_1.ApiPost)({ path: '/email/forgot-password' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgotPassword_request_dto_1.ForgotPasswordRequestDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, apiPost_decorator_1.ApiPost)({ path: '/email/verify-account' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sendVerifyEmail_request_dto_1.SendEmailVerfiyRequestDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendEmailVerify", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map