import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user';
import { Repository } from 'typeorm';
import { AbstractService } from 'src/commom/shared/abstract.service';

@Injectable()
export class UserService extends AbstractService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
  async userAlreadyExists(email: string): Promise<boolean> {
    return (await this.findOne({ email: email })) ? true : false;
  }
}
