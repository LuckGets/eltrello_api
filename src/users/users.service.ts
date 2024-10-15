import { Injectable } from '@nestjs/common';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { User } from './domain/user';
import { CreateUserDto } from './dto';
import { UserRepository } from './infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(private userRepo: UserRepository) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.provider = AuthProvidersEnum.email;
    return this.userRepo.create(createUserDto);
  }
}
