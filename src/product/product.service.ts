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

  sort(products: Product[], criteria: "asc" | "desc"): Product[] {
    return products.sort((a, b) => {
      const diff = a.price - b.price;
      if (diff === 0) return 0;
      const sign = Math.abs(diff) / diff;
      return criteria === 'asc' ? sign : -sign;
    });
  }
}
