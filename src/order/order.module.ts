import {  Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order';
import { OrderItem } from './order-items';
import { OrderController } from './order.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem])
  ],
  controllers: [OrderController],
  providers: [OrderService]

})
export class OrderModule {}
