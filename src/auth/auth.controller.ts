import {
  Body,
  Controller,
  Post,
  BadRequestException,
  NotFoundException,
  Res,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { RegisterDto } from './dtos/register.dto';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post(['admin/register', 'ambassador/register'])
  async register(@Body() body: RegisterDto, @Req() req: Request) {
    const { password_confirm, ...rest } = body;
    if (body.password !== password_confirm) {
      throw new BadRequestException('Passwords do not match');
    }
    if(await this.userService.userAlreadyExists(body.email)) {
      throw new BadRequestException("Email already taken by a user");
    }
    const is_ambassador =
      req.url === '/api/ambassador/register' ? true : false;
    return this.authService.newUser(rest, is_ambassador);
  }

  @Post(['admin/login', 'ambassador/login'])
  async login(
    @Body() { email, password }: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request
  ) {
    const user = await this.userService.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }
    
    const adminLogin = request.path === "/api/admin/login";
    if(user.is_ambassador && adminLogin) {
      throw new UnauthorizedException();
    }
    const jwt = await this.authService.generateJwt({
      id: user.id,
      last_name: user.last_name,
      scope: adminLogin ? 'admin': 'ambassador'
    });
    response.cookie('jwt', jwt, { httpOnly: true });

    return { message: 'success' };
  }

  @UseGuards(AuthGuard)
  @Post(['admin/logout', 'ambassador/logout'])
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'success',
    };
  }
}
