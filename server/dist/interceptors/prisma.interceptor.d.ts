import { NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClassConstructor } from 'class-transformer';
export declare class PrismaInterceptor<T> implements NestInterceptor {
    private dto;
    constructor(dto: ClassConstructor<T>);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
