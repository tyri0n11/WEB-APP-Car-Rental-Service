import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import {
  ResetPasswordTokenPayload,
  TokenPayload,
  VerifyAccountTokenPayload,
} from './interfaces/token.interface';
import { EmailService } from '../email/email.service';
import { TokenService } from '../token/interfaces/token.service';
import { SignupRequestDTO } from './dtos/request/signup.request.dto';
import { SignupResponseDTO } from './dtos/response/signup.response.dto';
import { LoginResponseDTO } from './dtos/response/login.response.dto';
import { UserResponseDTO } from '../user/dtos/response.dto';
import { ResetPasswordRequestDTO } from './dtos/request/resetPassword.dto';
import { ChangePasswordRequestDTO } from './dtos/request/changePassword.request.dto';

@Injectable()
export class AuthService {
  private SALT_ROUND = 10;
  private readonly FORGOT_PASSWORD_EXPIRATION_TIME = '15mins';
  private readonly VERIFY_ACCOUNT_EXPIRATION_TIME = '15mins';
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,

    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  private async verifyPlainContentWithHashedContent(
    plainText: string,
    hashedText: string,
  ): Promise<void> {
    const is_matching = await bcrypt.compare(plainText, hashedText);
    if (!is_matching) {
      throw new BadRequestException("Email or password doesn't match");
    }
  }

  async signup(dto: SignupRequestDTO): Promise<SignupResponseDTO> {
    const isExist = await this.userService.findByEmail(dto.email);
    if (isExist) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUND);

    const newUser = await this.userService.create({
      ...dto,
      isVerified: true, // for testing
      password: hashedPassword,
    });

    // await this.sendVerificationEmail(newUser.email);
    return newUser;
  }

  async login(userId: string): Promise<LoginResponseDTO> {
    const accessToken = this.generateAccessToken({
      userId,
    });
    const refreshToken = this.generateRefreshToken({
      userId,
    });
    await this.storeRefreshToken(userId, refreshToken);
    return { accessToken, refreshToken };
  }

  async getAuthenticatedUser(
    email: string,
    password: string,
  ): Promise<UserResponseDTO> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!user.isVerified) {
      throw new BadRequestException('User not verified');
    }
    await this.verifyPlainContentWithHashedContent(password, user.password);
    return user;
  }

  async getUserIfRefreshTokenMatched(
    userID: string,
    refreshToken: string,
  ): Promise<UserResponseDTO> {
    const user = await this.userService.findById(userID);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const currentRefreshToken = await this.cacheService.get<string>(userID);
    if (!currentRefreshToken) {
      throw new BadRequestException('Invalid token');
    }
    await this.verifyPlainContentWithHashedContent(
      refreshToken,
      currentRefreshToken,
    );
    return user;
  }

  generateAccessToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      algorithm: 'HS256',
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: `${this.configService.get<string>(
        'JWT_ACCESS_SECRET_EXPIRATION_TIME',
      )}s`,
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      algorithm: 'HS256',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: `${this.configService.get<string>(
        'JWT_REFRESH_SECRET_EXPIRATION_TIME',
      )}s`,
    });
  }

  async storeRefreshToken(user_id: string, token: string): Promise<void> {
    const hashedToken = await bcrypt.hash(token, this.SALT_ROUND);
    await this.cacheService.set(
      user_id,
      hashedToken,
      this.configService.get<number>('JWT_REFRESH_SECRET_EXPIRATION_TIME') *
        1000,
    );
  }

  async deleteRefreshToken(user_id: string): Promise<void> {
    await this.cacheService.del(user_id);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    const payload: ResetPasswordTokenPayload = {
      email,
    };

    const resetPasswordToken = await this.tokenService.signJwtWithSecret({
      payload,
      secret: user.password,
      exp: this.FORGOT_PASSWORD_EXPIRATION_TIME,
    });

    const fullName = `${user.firstName} ${user.lastName}`;

    await this.emailService.sendForgotPasswordEmail(
      fullName,
      email,
      resetPasswordToken,
    );
  }

  async resetPassword(dto: ResetPasswordRequestDTO): Promise<void> {
    const decoded = await this.jwtService.decode(dto.token);
    const user = await this.userService.findByEmail(decoded.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isValidToken = await this.tokenService.verifyJwtWithSecret(
      dto.token,
      user.password,
    );

    if (!isValidToken) {
      throw new BadRequestException('Invalid token');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, this.SALT_ROUND);
    await this.userService.update(
      { id: user.id },
      { password: hashedPassword },
    );

    this.logger.log(`Password reset for user ${user.id}`);
    await this.deleteRefreshToken(user.id);
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordRequestDTO,
  ): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.verifyPlainContentWithHashedContent(
      dto.oldPassword,
      user.password,
    );

    const hashedPassword = await bcrypt.hash(dto.newPassword, this.SALT_ROUND);
    await this.userService.update(
      { id: user.id },
      { password: hashedPassword },
    );

    await this.deleteRefreshToken(user.id);
    this.logger.log(`Password changed for user ${user.id}`);
  }

  async verifyAccount(token: string): Promise<void> {
    const decoded = await this.jwtService.decode(token);
    const user = await this.userService.findByEmail(decoded.email);

    if (user.isVerified) {
      throw new BadRequestException('Account already verified');
    }

    const isValidToken = await this.tokenService.verifyJwtWithSecret(
      token,
      user.password + user.isVerified,
    );

    if (!isValidToken) {
      throw new BadRequestException('Invalid token');
    }

    await this.userService.update({ id: user.id }, { isVerified: true });
  }

  async sendVerificationEmail(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);

    const fullName = `${user.firstName} ${user.lastName}`;

    if (user.isVerified) {
      throw new BadRequestException('Account already verifed');
    }

    const payload: VerifyAccountTokenPayload = {
      email,
    };

    const verifyToken = await this.tokenService.signJwtWithSecret({
      payload,
      secret: user.password + user.isVerified,
      exp: this.VERIFY_ACCOUNT_EXPIRATION_TIME,
    });

    await this.emailService.sendVerifyEmail(email, fullName, verifyToken);
  }
}
