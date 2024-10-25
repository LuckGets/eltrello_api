import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { User } from './domain/user';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserRepository } from './infrastructure/users.repository';
import { CryptoService } from '../utils';
import { IPaginationOptions, NullableType } from '../utils/types';
import { SortUsersDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private userRepo: UserRepository,
    private cryptoService: CryptoService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if this email is already existing in the DB
    if (createUserDto.email) {
      const isUserExist = await this.userRepo.findByEmail(createUserDto.email);
      if (isUserExist) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'email already exists',
          },
        });
      }
    }

    if (!createUserDto.provider) {
      createUserDto.provider = AuthProvidersEnum.email;
    }

    const password = await this.cryptoService.hash(createUserDto.password);

    return this.userRepo.create({ ...createUserDto, password });
  }

  async findByEmail(email: User['email']): Promise<NullableType<User>> {
    return this.userRepo.findByEmail(email);
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    return this.userRepo.findById(id);
  }

  async findManyWithPagination(
    sortOptions?: SortUsersDto[],
    paginationOption?: IPaginationOptions,
  ): Promise<NullableType<User[]>> {
    return this.userRepo.findManyWithPagination(sortOptions, paginationOption);
  }

  async update(
    id: User['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<NullableType<User>> {
    const userObj = await this.userRepo.findById(id);

    if (!userObj) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: `This User id : ${id} is not exist`,
        },
      });
    }

    let password: string;

    if (updateUserDto.password && userObj.password !== updateUserDto.password) {
      password = await this.cryptoService.hash(updateUserDto.password);
    }

    if (updateUserDto.email) {
      const isUserWithNewEmailExist = await this.userRepo.findByEmail(
        updateUserDto.email,
      );

      if (isUserWithNewEmailExist && isUserWithNewEmailExist.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: `The email provided already exist.`,
          },
        });
      }
    }
    return this.userRepo.update(id, { ...updateUserDto, password });
  }
}
