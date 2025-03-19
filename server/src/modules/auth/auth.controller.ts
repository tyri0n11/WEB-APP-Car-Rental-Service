import {
  Body,
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { RequestWithUser } from 'src/types/request.type';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { ForgotPasswordRequestDTO } from './dto/request/forgotPassword.request.dto';
import { LoginRequestDTO } from './dto/request/login.request.dto';
import { SignupRequestDTO } from './dto/request/signup.request.dto';
import { VerifyAccountRequestQuery } from './dto/request/verifyAccount.request.dto';
import { LoginResponseDTO } from './dto/response/login.response.dto';
import { ApiPost } from '@/decorators/apiPost.decorator';
import { LocalUserAuthGuard } from './guards/local/local.guard';
import { JwtAccessGuard } from './guards/jwt/jwtAccess.guard';
import { UserResponseDTO } from '../user/dto/response.dto';
import { JwtRefreshGuard } from './guards/jwt/jwtRefresh.guard';
import { RefreshTokenRequestDTO } from './dto/request/refreshToken.request.dto';
import { ResetPasswordRequestDTO } from './dto/request/resetPassword.dto';
import { SendEmailVerfiyRequestDTO } from './dto/request/sendVerifyEmail.request.dto';

@Controller('auth')
// @UseInterceptors(new PrismaInterceptor(User))
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) { }

  @ApiPost({
    path: 'signup',
    responseMessage:
      'User signed up successfully. Please check your email to verify your account',
  })
  async signup(@Body() dto: SignupRequestDTO) {
    await this.authService.signup(dto);
  }

  @ApiPost({ path: 'login' })
  @UseGuards(LocalUserAuthGuard)
  @ApiBody({
    type: LoginRequestDTO,
    examples: {
      user_1: {
        value: {
          email: 'user1@example.com',
          password: 'userPassword123!',
        } as LoginRequestDTO,
      },
      user_2: {
        value: {
          email: 'user2@example.com',
          password: 'userPassword123!',
        } as LoginRequestDTO,
      },
    },
  })
  @ApiOkResponse({
    description: 'Login successful',
    type: LoginResponseDTO,
  })
  async login(@Req() request: RequestWithUser) {
    const { user } = request;
    return await this.authService.login(user.id);
  }

  @UseGuards(JwtAccessGuard)
  @Get('me')
  @ApiOkResponse({ type: UserResponseDTO })
  async getMe(@Req() request: RequestWithUser) {
    const { user } = request;
    return await this.userService.findByEmail(user.email);
  }

  @UseGuards(JwtRefreshGuard)
  @ApiPost({ path: 'refresh-token' })
  @ApiBody({
    type: RefreshTokenRequestDTO,
  })
  async refreshAccessToken(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessToken = this.authService.generateAccessToken({
      userId: user.id,
    });
    return {
      accessToken,
    };
  }

  @ApiPost({ path: 'reset-password' })
  async resetPassword(@Body() dto: ResetPasswordRequestDTO) {
    return await this.authService.resetPassword(dto);
  }

  @ApiPost({ path: 'verify-account' })
  @ApiQuery({
    name: 'token',
    required: true,
    type: String,
  })
  async verifyAccount(@Query() query: VerifyAccountRequestQuery) {
    return await this.authService.verifyAccount(query.token);
  }

  @ApiPost({ path: '/email/forgot-password' })
  async forgotPassword(@Body() dto: ForgotPasswordRequestDTO) {
    console.log('Received Forgot Password Request:', dto);
    return await this.authService.forgotPassword(dto.email);
  }

  @ApiPost({ path: '/email/verify-account' })
  async sendEmailVerify(@Body() dto: SendEmailVerfiyRequestDTO) {
    return await this.authService.sendVerificationEmail(dto.email);
  }
}
