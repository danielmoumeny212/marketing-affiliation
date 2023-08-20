import { CreateProductDto, UpdateProductDto } from './dtos';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  Inject,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';
import { ProcessorService } from 'src/auth/processor.service';

@UseGuards(AuthGuard)
@Controller()
export class ProductController {
  constructor(
    private productService: ProductService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private processor: ProcessorService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get('admin/products')
  async allProducts() {
    return await this.productService.find({});
  }

  @Post('admin/products')
  async create(@Body() body: CreateProductDto) {
    const product = await this.productService.save(body);
    this.eventEmitter.emit('product_updated');
    return product;
  }

  @Get('admin/products/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findOne({ id });
  }

  @Put('admin/products/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() product: UpdateProductDto,
  ) {
    await this.productService.update(id, product);

    const updatedProduct = await this.productService.findOne({ where: { id } });
    this.eventEmitter.emit('product_updated');

    return updatedProduct;
  }

  @Delete('admin/products/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productService.delete(id);
    this.eventEmitter.emit('product_updated');

    return {
      message: 'product deleted successfully',
    };
  }
  @Get('ambassador/products/frontend')
  @CacheKey('products_frontend')
  @CacheTTL(30 * 60)
  @UseInterceptors(CacheInterceptor)
  async frontend() {
    return this.productService.find();
  }

  @Get('ambassador/products/backend')
  async backend(@Req() request: Request) {
    const { sort, search, page: currentPage } = request.query;
    let products = await this.productService.find();
    if (search) {
      products = this.processor.filter(products, search as string, [
        (item) => item.name,
        (item) => item.description,
      ]);
    }

    if (sort === 'asc' || sort === 'desc') {
      products = this.processor.sort(products, sort);
    }

    const page: number = parseInt(currentPage as any) || 1;
    const perPage = 9;
    const { data, total, last_page, next, previous } = this.processor.paginate(
      products,
      page,
      perPage,
    );

    const url = `${process.env.BASE_URL}${request.path}`;
    const nextPage = next === null ? null : `${url}?page=${next}`;
    const prevPage = previous === null ? null: `${url}?page=${previous}`;

    // let  products = await this.cacheManager.get("products_backend");
    // if(!products){
    //    products = await this.productService.find();
    //    await this.cacheManager.set("products_backend", products, 1000);
    // }
    return {
      total,
      prevPage,
      nextPage,
      last_page,
      data,
    };
  }
}
