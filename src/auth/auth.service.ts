import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  private readonly salt = 12;

  constructor(private userService: UserService, private jwtService: JwtService) {}

  private async hashPwd(pwd: string): Promise<string> {
    return await bcrypt.hash(pwd, this.salt);
  }

  async checkCookie(cookie: any) {
    return await this.jwtService.verifyAsync(cookie);
  }

  async newUser(options): Promise<void> {
    return await this.userService.save({
      ...options,
      password: await this.hashPwd(options.password),
      is_ambassador: false,
    });
  }

  async generateJwt(payload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
