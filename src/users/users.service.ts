import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { User } from './domain/user';
import { CreateUserDto } from './dto';
import { UserRepository } from './infrastructure/users.repository';

export class UsersService {
  constructor(private userRepo: UserRepository) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.provider = AuthProvidersEnum.email;
    return this.userRepo.create(createUserDto);
  }
}
