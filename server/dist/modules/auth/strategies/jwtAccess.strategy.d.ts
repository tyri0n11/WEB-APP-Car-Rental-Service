import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';
import { TokenPayload } from '../interfaces/token.interface';
declare const JwtAccessStrategy_base: new (...args: any) => any;
export declare class JwtAccessStrategy extends JwtAccessStrategy_base {
    private readonly userService;
    private readonly configService;
    constructor(userService: UserService, configService: ConfigService);
    validate(payload: TokenPayload): Promise<any>;
}
export {};
