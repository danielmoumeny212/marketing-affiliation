import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { RedisService } from './redis.service';
import { ProcessorService } from './processor.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  
  ],
  providers: [
    RedisService,
    ProcessorService,
  ],
  exports: [
    JwtModule,
    CacheModule,
    RedisService
  ]
})
export class SharedModule {}
