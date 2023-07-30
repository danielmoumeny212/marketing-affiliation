import { Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product';
import { Repository } from 'typeorm';
import { User } from 'src/user/user';

@Controller('product')
export class ProductController {
  constructor(@InjectRepository(Product) private readonly productRepository: Repository<User>){}
}
