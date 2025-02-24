import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class GlobalExceptionFilter implements ExceptionFilter {
    private readonly configService;
    constructor(configService: ConfigService);
    catch(exception: any, host: ArgumentsHost): void;
}
