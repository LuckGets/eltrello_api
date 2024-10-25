import { User } from '../../domain/user';
import { UserRepository } from '../users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { UserSchemaClass } from './entities/user.schema';
import { Model } from 'mongoose';
import { UserMapper } from './mappers/user.mapper';

import { Injectable } from '@nestjs/common';
import { DomainEntityDto, UpdateUserDto } from 'src/users/dto';
import {
  IPaginationOptions,
  NullableType,
  OrderQuery,
} from '../../../utils/types';
import { SortUsersDto } from '../../dto/query-user.dto';

@Injectable()
export class UsersDocumentRepository implements UserRepository {
  constructor(
    @InjectModel(UserSchemaClass.name)
    private readonly usersModel: Model<UserSchemaClass>,
  ) {}

  async create(data: DomainEntityDto): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(data);
    const createdUser = new this.usersModel(persistenceModel);
    const userObject = await createdUser.save();
    return UserMapper.toDomain(userObject);
  }

  async findByEmail(email: User['email']): Promise<NullableType<User>> {
    if (!email) return null;

    const userObj = await this.usersModel.findOne({ email });
    return userObj ? UserMapper.toDomain(userObj) : null;
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    const userObj = await this.usersModel.findById(id);
    return userObj ? UserMapper.toDomain(userObj) : null;
  }

  async findManyWithPagination(
    sortOptions?: Array<SortUsersDto>,
    paginationOption?: IPaginationOptions,
  ): Promise<Array<User>> {
    const userLists = await this.usersModel
      .find()
      .sort(
        sortOptions?.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.orderBy === 'id' ? '_id' : curr.orderBy]:
              curr.order === OrderQuery.ASC ? 1 : -1,
          }),
          {},
        ),
      )
      .skip((paginationOption.page - 1) * paginationOption.limit)
      .limit(paginationOption.limit);
    return userLists.map((item) => UserMapper.toDomain(item));
  }

  async update(
    id: User['id'],
    updateUserDto: Partial<User>,
  ): Promise<NullableType<User>> {
    const clonedPayload = { ...updateUserDto };
    const user = await this.usersModel.findById(id);

    const filter = { _id: id.toString() };

    if (!user) {
      return null;
    }

    const userObj = await this.usersModel.findOneAndUpdate(
      filter,
      UserMapper.toPersistence({
        ...UserMapper.toDomain(user),
        ...clonedPayload,
      }),
    );

    return userObj ? UserMapper.toDomain(userObj) : null;
  }
}
