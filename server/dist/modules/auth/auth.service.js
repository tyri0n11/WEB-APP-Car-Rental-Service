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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const email_service_1 = require("../email/email.service");
const token_service_1 = require("../token/interfaces/token.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(userService, jwtService, configService, emailService, tokenService, cacheService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
        this.tokenService = tokenService;
        this.cacheService = cacheService;
        this.SALT_ROUND = 10;
        this.FORGOT_PASSWORD_EXPIRATION_TIME = '15mins';
        this.VERIFY_ACCOUNT_EXPIRATION_TIME = '15mins';
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async verifyPlainContentWithHashedContent(plainText, hashedText) {
        const is_matching = await bcrypt.compare(plainText, hashedText);
        if (!is_matching) {
            throw new common_1.BadRequestException("Email or password doesn't match");
        }
    }
    async signup(dto) {
        const isExist = await this.userService.findByEmail(dto.email);
        if (isExist) {
            throw new common_1.BadRequestException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUND);
        const newUser = await this.userService.create({
            ...dto,
            password: hashedPassword,
        });
        await this.sendVerificationEmail(newUser.email);
        return newUser;
    }
    async login(userId) {
        const accessToken = this.generateAccessToken({
            userId,
        });
        const refreshToken = this.generateRefreshToken({
            userId,
        });
        await this.storeRefreshToken(userId, refreshToken);
        return { accessToken, refreshToken };
    }
    async getAuthenticatedUser(email, password) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (!user.isVerified) {
            throw new common_1.BadRequestException('User not verified');
        }
        await this.verifyPlainContentWithHashedContent(password, user.password);
        return user;
    }
    async getUserIfRefreshTokenMatched(userID, refreshToken) {
        const user = await this.userService.findById(userID);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const currentRefreshToken = await this.cacheService.get(userID);
        if (!currentRefreshToken) {
            throw new common_1.BadRequestException('Invalid token');
        }
        await this.verifyPlainContentWithHashedContent(refreshToken, currentRefreshToken);
        return user;
    }
    generateAccessToken(payload) {
        return this.jwtService.sign(payload, {
            algorithm: 'HS256',
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: `${this.configService.get('JWT_ACCESS_SECRET_EXPIRATION_TIME')}s`,
        });
    }
    generateRefreshToken(payload) {
        return this.jwtService.sign(payload, {
            algorithm: 'HS256',
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: `${this.configService.get('JWT_REFRESH_SECRET_EXPIRATION_TIME')}s`,
        });
    }
    async storeRefreshToken(user_id, token) {
        const hashedToken = await bcrypt.hash(token, this.SALT_ROUND);
        await this.cacheService.set(user_id, hashedToken, this.configService.get('JWT_REFRESH_SECRET_EXPIRATION_TIME') *
            1000);
    }
    async forgotPassword(email) {
        const user = await this.userService.findByEmail(email);
        const payload = {
            email,
        };
        const resetPasswordToken = await this.tokenService.signJwtWithSecret({
            payload,
            secret: user.password,
            exp: this.FORGOT_PASSWORD_EXPIRATION_TIME,
        });
        await this.emailService.sendUserResetPasswordEmail(email, resetPasswordToken);
    }
    async resetPassword(dto) {
        const decoded = await this.jwtService.decode(dto.token);
        const user = await this.userService.findByEmail(decoded.email);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const isValidToken = await this.tokenService.verifyJwtWithSecret(dto.token, user.password);
        if (!isValidToken) {
            throw new common_1.BadRequestException('Invalid token');
        }
        const hashedPassword = await bcrypt.hash(dto.newPassword, this.SALT_ROUND);
        await this.userService.update({ id: user.id }, { password: hashedPassword });
    }
    async verifyAccount(token) {
        const decoded = await this.jwtService.decode(token);
        const user = await this.userService.findByEmail(decoded.email);
        if (user.isVerified) {
            throw new common_1.BadRequestException('Account already verified');
        }
        const isValidToken = await this.tokenService.verifyJwtWithSecret(token, user.password + user.isVerified);
        if (!isValidToken) {
            throw new common_1.BadRequestException('Invalid token');
        }
        await this.userService.update({ id: user.id }, { isVerified: true });
    }
    async sendVerificationEmail(email) {
        const user = await this.userService.findByEmail(email);
        const fullName = `${user.firstName} ${user.lastName}`;
        if (user.isVerified) {
            throw new common_1.BadRequestException('Account already verifed');
        }
        const payload = {
            email,
        };
        const verifyToken = await this.tokenService.signJwtWithSecret({
            payload,
            secret: user.password + user.isVerified,
            exp: this.VERIFY_ACCOUNT_EXPIRATION_TIME,
        });
        await this.emailService.sendUserVerifyEmail(email, fullName, verifyToken);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService,
        token_service_1.TokenService, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map