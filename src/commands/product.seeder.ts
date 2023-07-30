import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module"
import { faker } from '@faker-js/faker';
import { ProductService } from "src/product/product.service";

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule); 

  const productService = app.get(ProductService); 
  for( let i = 0; i < 30; i++ ) {
     
    await productService.save({
        name: faker.lorem.word(4),
        description: faker.lorem.words(10),
        image: faker.image.urlPicsumPhotos({width: 200, height: 200}),
        price: faker.number.int({min: 1, max: 250}) 
    })
  }
  process.exit(); 
}) (); 
