import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module"
import { faker } from '@faker-js/faker';
import { AuthService } from "src/auth/auth.service";

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule); 

  const authService = app.get(AuthService); 
  for( let i = 0; i < 30; i++ ) {
     
    await authService.newUser({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: "123456",
        is_ambassador: true, 
    })
  }
  process.exit(); 
}) (); 
