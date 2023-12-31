import {
  BadRequestException,
  Controller,
  Get,
  Put,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ResetUserPwdDto, UpdateUserDto } from './dtos';
import { Request } from 'express';
import * as bcrypt from 'bcryptjs';
import { AuthService } from 'src/auth/auth.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('admin/ambassadors')
  async ambassadors() {
    return this.userService.find({
      is_ambassador: true,
    });
  }

  @UseGuards(AuthGuard)
  @Put(['admin/users/info', "ambassador/users/info"])
  async updateInfo(
    @Req() request: Request,
    @Body() { email, first_name, last_name }: UpdateUserDto,
  ) {
    const cookie = request.cookies['jwt'];
    const { id } = await this.authService.checkCookie(cookie);

    await this.userService.update(id, {
      email,
      first_name,
      last_name,
    });
    return this.userService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Put('admin/users/password')
  async updatePassword(
    @Req() request: Request,
    @Body() { password, password_confirm }: ResetUserPwdDto,
  ) {
    if (password !== password_confirm) {
      throw new BadRequestException('Passwords do not match!');
    }
    const cookie = request.cookies['jwt'];
    const { id } = await this.authService.checkCookie(cookie);

    await this.userService.update(id, {
      password: await bcrypt.hash(password, 12),
    });

    return this.userService.findOne({ id });
  }
  @UseGuards(AuthGuard)
  @Get(['admin/me', "ambassador/me"])
  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt'];
    const { id } = await this.authService.checkCookie(cookie);
    const user = await this.userService.findOne({ where: {id} , relations: ["orders", "orders.order_items"]});
    
    return {
      ...user, 
      revenue: user.revenue 
    }
  }

  @Get("ambassador/rankings")
  async rankings(){
    const ambassadors  = await this.userService.find({
      where: {is_ambassador: true},
      relations: ['orders', 'orders.order_items']

    }); 

    return ambassadors.map(ambassador => {
      return {
        name: ambassador.name, 
        revenue: ambassador.revenue

      }
    })

  }
}
