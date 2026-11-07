import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly log = new Logger(CacheService.name);
  private readonly redis?: Redis;
  readonly enabled =
    process.env.CACHE_ENABLED === 'true' && !!process.env.REDIS_URL;

  constructor() {
    if (!this.enabled) return;
    this.redis = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: 1 });
    this.redis.on('error', (e) => this.log.warn(`redis: ${e.message}`));
  }

  async get<T>(key: string): Promise<T | undefined> {
    if (!this.redis) return;
    try {
      const raw = await this.redis.get(key);
      await this.redis.incr(raw ? 'stats:hit' : 'stats:miss');
      return raw ? (JSON.parse(raw) as T) : undefined;
    } catch {
      return;
    }
  }

  async set(key: string, value: unknown, ttlSec: number) {
    await this.redis
      ?.set(key, JSON.stringify(value), 'EX', ttlSec)
      .catch(() => {});
  }

  async delByPrefix(prefix: string) {
    if (!this.redis) return;
    try {
      const keys = await this.redis.keys(`${prefix}*`);
      if (keys.length) await this.redis.del(...keys);
    } catch {
    }
  }

  async stats() {
    if (!this.redis) return { enabled: false };
    const [hit, miss] = (await this.redis.mget('stats:hit', 'stats:miss')).map(
      (v) => Number(v ?? 0),
    );
    return {
      enabled: true,
      hit,
      miss,
      hitRate: hit + miss ? hit / (hit + miss) : 0,
    };
  }

  async onModuleDestroy() {
    await this.redis?.quit().catch(() => {});
  }
}
