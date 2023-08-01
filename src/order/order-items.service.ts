import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/commom/shared/abstract.service';
import { OrderItem } from './order-items';

@Injectable()
export class OrderItemService extends AbstractService<OrderItem>{
   constructor(@InjectRepository(OrderItem) private readonly orderItemRepository){
      super(orderItemRepository);
   }
}
