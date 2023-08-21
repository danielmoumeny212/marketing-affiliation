import {  Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order';
import { OrderItem } from './order-items';
import { OrderController } from './order.controller';
import { OrderItemService } from './order-items.service';
import { LinkModule } from 'src/link/link.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    LinkModule,
    ProductModule
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderItemService]

})
export class OrderModule {}
