import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/commom/shared/abstract.service';
import { Order } from './order';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderService extends AbstractService<Order> {
  constructor(@InjectRepository(Order) private readonly orderRepository){
       super(orderRepository);

  }
}
