// src/interceptors/track-view.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { UserActionService } from '../../modules/user-action/user-action.service';
import { ActionType } from '@prisma/client';

@Injectable()
export class TrackViewInterceptor implements NestInterceptor {
  constructor(private readonly userActionService: UserActionService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest();
        if (request.user && request.params.id) {
          this.userActionService.trackView({
            userId: request.user.id,
            carId: request.params.id,
            metadata: {
              referrer: request.headers.referer || 'direct',
              timestamp: new Date(),
            },
          });
        }
      }),
    );
  }
}
