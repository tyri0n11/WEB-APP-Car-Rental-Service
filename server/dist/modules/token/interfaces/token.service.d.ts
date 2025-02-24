import { JwtService } from '@nestjs/jwt';
import { SignTokenWithSecretInterface } from './token.interface';
export declare class TokenService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    signJwtWithSecret({ payload, secret, exp, }: SignTokenWithSecretInterface): string;
    verifyJwtWithSecret(token: string, secret: string): Promise<boolean>;
    signJwt(payload: object, exp: string): string;
    verifyJwt(token: string): Promise<boolean>;
}
