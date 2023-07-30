import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/commom/shared/abstract.service';
import { Product } from './product';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService extends AbstractService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    super(productRepository);
  }
}
