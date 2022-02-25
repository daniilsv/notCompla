import { CacheModule as _CacheModule, Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Module({
  imports: [_CacheModule.register()],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule { }
