import { ClassSerializerInterceptor } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
  Req,
  Post,
} from '@nestjs/common';
import { Request } from 'express';
import { LinkService } from './link.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Order } from 'src/order/order';

// @UseGuards(AuthGuard)
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class LinkController {
  constructor(
    private linkService: LinkService,
    private authService: AuthService,
  ) {}

  @Get('admin/users/:id/links')
  async all(@Param('id', ParseIntPipe) id: number) {
    return this.linkService.find({
      user: id,
      relations: ['orders'],
    });
  }

  @Post('/ambassador/links')
  async create(@Body('products') products: number[], @Req() request: Request) {
    const user = await this.authService.getAuthenticatedUser(request);

    return this.linkService.save({
      code: Math.random().toString().substring(6),
      user,
      products: products.map((id) => ({
        id,
      })),
    });
  }

  @Get('ambassador/stats')
  async stats(@Req() request: Request) {
    const user = this.authService.getAuthenticatedUser(request);

    const links = await this.linkService.find({
      where: { user },
      relations: ['orders'],
    });
    return links.map((link) => {
      const completeOrders: Order[] = link.orders.filter((o) => o.complete);

      return {
        code: link.code,
        count: completeOrders.length,
        revenue: completeOrders.reduce((s, o) => s + o.ambassador_revenue, 0),
      };
    });
  }

  @Get('checkout/links/:code')
  async links(@Param('code') code: string) {
    return this.linkService.findOne({
      where: { code },
      relations: ['user', 'products'],
    });
  }
}
