import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { CacheService } from '../cache/cache.service';

const RESULT_TTL_SEC = 24 * 60 * 60;
const LOCK_TTL_SEC = 60;
const PENDING = 'pending';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly log = new Logger(IdempotencyInterceptor.name);

  constructor(private readonly cache: CacheService) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = ctx.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();
    const header = req.headers['idempotency-key'];
    if (!header || typeof header !== 'string' || !this.cache.available) {
      return next.handle();
    }
    const key = `idem:${req.user?.userId ?? 'anon'}:${header}`;

    return from(this.begin(key)).pipe(
      mergeMap((stored) => {
        if (stored === 'proceed') {
          return next.handle().pipe(
            mergeMap(async (body) => {
              await this.cache
                .setRaw(
                  key,
                  JSON.stringify({ status: res.statusCode, body }),
                  RESULT_TTL_SEC,
                )
                .catch((e) => this.log.warn(`store failed: ${e.message}`));
              return body;
            }),
            catchError((err) =>
              from(this.cache.del(key).catch(() => {})).pipe(
                mergeMap(() => throwError(() => err)),
              ),
            ),
          );
        }
        if (stored === PENDING) {
          return throwError(
            () => new ConflictException('Request with this key is in progress'),
          );
        }
        const { status, body } = JSON.parse(stored);
        res.status(status);
        res.setHeader('Idempotent-Replayed', 'true');
        return of(body);
      }),
    );
  }

  private async begin(key: string): Promise<string> {
    try {
      if (await this.cache.setNx(key, PENDING, LOCK_TTL_SEC)) return 'proceed';
      return (await this.cache.getRaw(key)) ?? 'proceed';
    } catch (e) {
      this.log.warn(
        `redis unavailable, skipping idempotency: ${(e as Error).message}`,
      );
      return 'proceed';
    }
  }
}
