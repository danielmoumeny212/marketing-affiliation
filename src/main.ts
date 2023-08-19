import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe} from "@nestjs/common"; 
import * as cookieParser from "cookie-parser"
import { loggerMiddleWare } from './commom/middleware/logger.middleware';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(loggerMiddleWare)
  app.enableCors(
    {
       origin: [ 'http://localhost:4200'],
       credentials: true, 
    }
  );
  await app.listen(3000);
}
bootstrap();
