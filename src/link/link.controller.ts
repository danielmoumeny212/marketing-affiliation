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

@Controller()
export class LinkController {
  constructor(
    private linkService: LinkService,
    private authService: AuthService,
  ) {}

  // @UseGuards(AuthGuard)
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
      code: Math.random.toString().substring(6),
      user,
      products: products.map((id) => ({
        id,
      })),
    });
  }
}
