import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order';
import { OrderItem } from './order-items';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem])
  ],
  providers: [OrderService]
})
export class OrderModule {}
