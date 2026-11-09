import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly log = new Logger(CacheService.name);
  private readonly redis?: Redis;
  readonly enabled =
    process.env.CACHE_ENABLED === 'true' && !!process.env.REDIS_URL;

  constructor() {
    if (!process.env.REDIS_URL) return;
    this.redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: 1 });
    this.redis.on('error', (e) => this.log.warn(`redis: ${e.message}`));
  }

  async get<T>(key: string): Promise<T | undefined> {
    if (!this.enabled || !this.redis) return;
    try {
      const raw = await this.redis.get(key);
      return raw ? (JSON.parse(raw) as T) : undefined;
    } catch {
      return;
    }
  }

  async set(key: string, value: unknown, ttlSec: number) {
    if (!this.enabled) return;
    await this.redis
      ?.set(key, JSON.stringify(value), 'EX', ttlSec)
      .catch(() => {});
  }

  async delByPrefix(prefix: string) {
    if (!this.enabled || !this.redis) return;
    try {
      const keys = await this.redis.keys(`${prefix}*`);
      if (keys.length) await this.redis.del(...keys);
    } catch {}
  }

  get available() {
    return !!this.redis;
  }

  async setNx(key: string, value: string, ttlSec: number) {
    return (await this.redis!.set(key, value, 'EX', ttlSec, 'NX')) === 'OK';
  }

  async getRaw(key: string) {
    return this.redis!.get(key);
  }

  async setRaw(key: string, value: string, ttlSec: number) {
    await this.redis!.set(key, value, 'EX', ttlSec);
  }

  async del(key: string) {
    await this.redis!.del(key);
  }

  async onModuleDestroy() {
    await this.redis?.quit().catch(() => {});
  }
}
