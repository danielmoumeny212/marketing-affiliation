import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LinkService } from './link.service';

@Controller()
export class LinkController {
  
  constructor(
    private linkServices: LinkService
  ){

  }

  @Get("admin/users/:id/links")
  async all(@Param("id", ParseIntPipe) id: number ){
      return this.linkServices.find({
        user: id
      })
  }

}
