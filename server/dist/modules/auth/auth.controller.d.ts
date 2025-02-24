import { ConfigService } from '@nestjs/config';
import { RequestWithUser } from 'src/types/request.type';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { ForgotPasswordRequestDTO } from './dto/request/forgotPassword.request.dto';
import { SignupRequestDTO } from './dto/request/signup.request.dto';
import { VerifyAccountRequestQuery } from './dto/request/verifyAccount.request.dto';
import { LoginResponseDTO } from './dto/response/login.response.dto';
import { ResetPasswordRequestDTO } from './dto/request/resetPassword.dto';
import { SendEmailVerfiyRequestDTO } from './dto/request/sendVerifyEmail.request.dto';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    private readonly configService;
    constructor(authService: AuthService, userService: UserService, configService: ConfigService);
    signup(dto: SignupRequestDTO): Promise<import("./dto/response/signup.response.dto").SignupResponseDTO>;
    login(request: RequestWithUser): Promise<LoginResponseDTO>;
    getMe(request: RequestWithUser): Promise<any>;
    refreshAccessToken(request: RequestWithUser): Promise<{
        accessToken: string;
    }>;
    resetPassword(dto: ResetPasswordRequestDTO): Promise<void>;
    verifyAccount(query: VerifyAccountRequestQuery): Promise<void>;
    forgotPassword(dto: ForgotPasswordRequestDTO): Promise<void>;
    sendEmailVerify(dto: SendEmailVerfiyRequestDTO): Promise<void>;
}
