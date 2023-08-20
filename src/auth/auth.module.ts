import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthGuard } from './auth.guard';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import { ProcessorService } from './processor.service';

@Global()
@Module({
  imports: [
    UserModule,
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
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, ProcessorService],
  exports: [
    AuthService,
    ProcessorService,
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
})
export class AuthModule {}
