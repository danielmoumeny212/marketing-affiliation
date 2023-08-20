import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { Request } from 'express';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly salt = 12;

  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async hashPwd(pwd: string): Promise<string> {
    return await bcrypt.hash(pwd, this.salt);
  }

  async checkCookie(cookie: any) {
    return await this.jwtService.verifyAsync(cookie);
  }

  async newUser(options, is_ambassador = false): Promise<void> {
    return await this.userService.save({
      ...options,
      password: await this.hashPwd(options.password),
      is_ambassador: is_ambassador,
    });
  }

  async generateJwt(payload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
  async getAuthenticatedUser(request: Request) {
    const { id } = await this.checkCookie(request.cookies['jwt']);

    return this.userService.findOne({ where: { id } });
  }
}
