import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from "./constants";
import { LoggerMiddleware } from "src/commom/middleware/logger.middleware";


@Module({
  imports: [UserModule , 
    JwtModule.register({
      // global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.
      apply(LoggerMiddleware)
      .forRoutes("*")
  }

}