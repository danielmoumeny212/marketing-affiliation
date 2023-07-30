import { CreateProductDto, UpdateProductDto } from './dtos';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private productService: ProductService){}

  @Get("admin/products")
  async allProducts(){
    return await this.productService.find({});
  }

  @Post("admin/products")
  async create(@Body() product: CreateProductDto){ 
   return await this.productService.save(product);
  } 

  @Get("admin/products/:id")
  async findOne(@Param("id", ParseIntPipe) id: number){
     return await this.productService.findOne({id})
  }

  @Put("admin/products/:id")
  async update(@Param("id", ParseIntPipe) id: number, 
             @Body() product: UpdateProductDto){
     await this.productService.update(id, product); 
     return await this.productService.findOne({id});
  }

  @Delete("admin/products/:id")
  async remove (@Param("id", ParseIntPipe) id: number){
      await this.productService.delete(id);
      return {
        message: "product deleted successfully"
      }
  }
}
