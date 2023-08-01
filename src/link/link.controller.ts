import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LinkService } from './link.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller()
export class LinkController {
  
  constructor(
    private linkServices: LinkService
  ){

  }
  
  @UseGuards(AuthGuard)
  @Get("admin/users/:id/links")
  async all(@Param("id", ParseIntPipe) id: number ){
      return this.linkServices.find({
        user: id,
        relations: ['orders']
      })
  }

}
