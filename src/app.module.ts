import {  Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { LinkModule } from './link/link.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Manassedaniel2001@',
      database: 'ambassador',
      autoLoadEntities: true,
      synchronize: true,
    }),
    EventEmitterModule.forRoot(

    ),
    UserModule,
    AuthModule,
    ProductModule,
    OrderModule,
    LinkModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

