import { Injectable } from '@nestjs/common';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { User } from './domain/user';
import { CreateUserDto } from './dto';
import { UserRepository } from './infrastructure/users.repository';
import { CryptoService } from '../utils';

@Injectable()
export class UsersService {
  constructor(
    private userRepo: UserRepository,
    private cryptoService: CryptoService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.provider = AuthProvidersEnum.email;

    if (createUserDto.password) {
      createUserDto.password = await this.cryptoService.hash(
        createUserDto.password,
      );
    }

    console.log(createUserDto);
    return this.userRepo.create(createUserDto);
  }
}
