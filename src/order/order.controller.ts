import { Controller, Get } from "@nestjs/common";
import { OrderService } from "./order.service";
import { ClassSerializerInterceptor, UseInterceptors } from "@nestjs/common";


@Controller()
export class OrderController {
  
  constructor(private orderService: OrderService){

  }
@UseInterceptors(ClassSerializerInterceptor)
@Get("admin/orders")
  async all(){
     return await this.orderService.find({
      relations: ['order_items']
     })
  }
}