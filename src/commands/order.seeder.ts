import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module"
import { faker } from '@faker-js/faker';
import { OrderService } from "src/order/order.service";
import { randomInt } from "crypto";
import { OrderItemService } from "src/order/order-items.service";

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule); 

  const orderService = app.get(OrderService);
  const orderItemService = app.get(OrderItemService); 
  for( let i = 0; i < 30; i++ ) {
     
   const order =  await orderService.save(
    {
        user_id: faker.number.int({min: 1, max: 30 }),
        code: faker.lorem.slug(2),
        ambassador_email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        complete: true,
    }
    ); 

    for(let j = 0; j < randomInt(1, 5); j++) {
       await orderItemService.save({
         order ,
         product_title: faker.lorem.words(2),
         price: randomInt(10, 100),
         quantity: randomInt(1, 5),
         admin_revenue: randomInt(10, 100),
         ambassador_revenue: randomInt(10, 10)
       })
    }
  }
  process.exit(); 
}) (); 
