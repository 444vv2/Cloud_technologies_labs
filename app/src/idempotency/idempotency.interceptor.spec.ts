import { ConflictException } from '@nestjs/common';
import { firstValueFrom, of } from 'rxjs';
import { IdempotencyInterceptor } from './idempotency.interceptor';

class FakeCache {
  available = true;
  store = new Map<string, string>();
  async setNx(k: string, v: string) {
    if (this.store.has(k)) return false;
    this.store.set(k, v);
    return true;
  }
  async getRaw(k: string) {
    return this.store.get(k) ?? null;
  }
  async setRaw(k: string, v: string) {
    this.store.set(k, v);
  }
  async del(k: string) {
    this.store.delete(k);
  }
}

function setup(key?: string) {
  const cache = new FakeCache();
  const interceptor = new IdempotencyInterceptor(cache as any);
  let writes = 0;
  const run = () => {
    const res: any = {
      statusCode: 202,
      status(c: number) {
        this.statusCode = c;
      },
      setHeader: jest.fn(),
    };
    const req = {
      headers: key ? { 'idempotency-key': key } : {},
      user: { userId: 'u1' },
    };
    const ctx: any = {
      switchToHttp: () => ({ getRequest: () => req, getResponse: () => res }),
    };
    const next = {
      handle: () => {
        writes++;
        return of({ id: `song-${writes}`, status: 'pending' });
      },
    };
    return firstValueFrom(interceptor.intercept(ctx, next)).then((body) => ({
      body,
      res,
    }));
  };
  return { run, cache, writes: () => writes };
}

describe('IdempotencyInterceptor', () => {
  it('two identical requests -> one write, identical responses', async () => {
    const t = setup('k1');
    const a = await t.run();
    const b = await t.run();
    expect(t.writes()).toBe(1);
    expect(b.body).toEqual(a.body);
    expect(b.res.statusCode).toBe(202);
    expect(b.res.setHeader).toHaveBeenCalledWith('Idempotent-Replayed', 'true');
  });

  it('without the header every request is executed', async () => {
    const t = setup();
    await t.run();
    await t.run();
    expect(t.writes()).toBe(2);
  });

  it('request with a key that is still in progress -> 409', async () => {
    const t = setup('k2');
    t.cache.store.set('idem:u1:k2', 'pending');
    await expect(t.run()).rejects.toBeInstanceOf(ConflictException);
    expect(t.writes()).toBe(0);
  });
});
