import { User } from 'src/users/domain/user';
import { UserRepository } from '../users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { UserSchemaClass } from './entities/user.schema';
import { Model } from 'mongoose';
import { UserMapper } from './mappers/user.mapper';

import { Injectable } from '@nestjs/common';
import { DomainEntityDto } from 'src/users/dto';

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
}
