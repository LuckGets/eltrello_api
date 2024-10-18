import { User } from 'src/users/domain/user';
import { UserRepository } from '../users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { UserSchemaClass } from './entities/user.schema';
import { Model } from 'mongoose';
import { UserMapper } from './mappers/user.mapper';

import { Injectable } from '@nestjs/common';
import { DomainEntityDto } from 'src/users/dto';
import { NullableType } from '../../../utils/types';

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
}
