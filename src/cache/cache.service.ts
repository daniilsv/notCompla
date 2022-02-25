import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
    constructor(
        @Inject(CACHE_MANAGER) private cache: Cache,
    ) { }

    async setCache<T>(key: string, callback: Promise<T>): Promise<T> {
        const cached = await this.cache.get<T>(key);
        if (!!cached) return cached;
        const value = await callback;
        this.cache.set(key, value, { ttl: 60 });
        return value;
    }

    dropCache(key: string) {
        this.cache.del(key);
    }
}
