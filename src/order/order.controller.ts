import { LinkService } from './../link/link.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Order } from './order';
import { ProductService } from 'src/product/product.service';
import { OrderItem } from './order-items';
import { OrderItemService } from './order-items.service';
import { DataSource } from 'typeorm';
@Controller()
export class OrderController {
  constructor(
    private orderService: OrderService,
    private linkService: LinkService,
    private productService: ProductService,
    private orderItemService: OrderItemService,
    private dataSource: DataSource,
  ) {}
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('admin/orders')
  async all() {
    return await this.orderService.find({
      relations: ['order_items'],
    });
  }

  @Post('checkout/orders')
  async create(@Body() body: CreateOrderDto) {
    const link = await this.linkService.findOne({
      where: { code: body.code },
      relations: ['user'],
    });
    if (!link) {
      throw new BadRequestException('Invalid Link');
    }
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const o = new Order();
      o.user_id = link.user.id;
      o.ambassador_email = link.user.email;
      o.first_name = body.first_name;
      o.email = body.email;
      o.last_name = body.last_name;
      o.country = body.country;
      o.address = body.address;
      o.country = body.country;
      o.zip = body.zip;
      o.code = body.code;

      const order = await queryRunner.manager.save(o);

      for (const p of body.products) {
        const product = await this.productService.findOne({
          where: { id: p.product_id },
        });

        const orderItem = new OrderItem();
        orderItem.order = order;
        orderItem.product_name = product.name;
        orderItem.price = product.price;
        orderItem.quantity = p.quantity;
        orderItem.ambassador_revenue = 0.1 * product.price * p.quantity;

        await queryRunner.manager.save(orderItem);
      }
      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(); 
    } finally {
      queryRunner.release();
    }
  }
}
