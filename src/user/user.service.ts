import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user';
import { Repository } from 'typeorm';
import { AbstractService } from 'src/commom/shared/abstract.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService extends AbstractService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService
  ) {
    super(userRepository);
  }
  async userAlreadyExists(email: string): Promise<boolean> {
    return (await this.findOne({ where: {email} })) ? true : false;
  }
  async newUser(options, is_ambassador = false): Promise<void> {
    return await this.save({
      ...options,
      password: await this.authService.hashPwd(options.password),
      is_ambassador: is_ambassador,
    });
  }
}
