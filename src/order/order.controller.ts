import { Controller, Get } from "@nestjs/common";
import { OrderService } from "./order.service";


@Controller()
export class OrderController {
  
  constructor(private orderService: OrderService){

  }
  
  @Get("admin/orders")
  async all(){
     return await this.orderService.find()
  }
}