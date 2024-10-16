import { AuthProvidersEnum } from 'src/auth/auth-providers.enum';
import { User } from '../../../domain/user';
import { UserSchemaClass } from '../entities/user.schema';
import { DomainEntityDto } from 'src/users/dto';

export class UserMapper {
  static toDomain(rawData: UserSchemaClass): User {
    const domainEntity = new User();
    domainEntity.id = rawData._id.toString();
    domainEntity.email = rawData.email;
    domainEntity.username = rawData.username;
    domainEntity.password = rawData.password;
    domainEntity.provider = rawData.provider;

    domainEntity.createdAt = rawData.createdAt;
    domainEntity.updatedAt = rawData.updatedAt;
    domainEntity.deletedAt = rawData.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: DomainEntityDto): UserSchemaClass {
    const persistenceSchema = new UserSchemaClass();
    if (domainEntity.id && typeof domainEntity.id == 'string') {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.email = domainEntity.email;
    persistenceSchema.username = domainEntity.username;
    persistenceSchema.password = domainEntity.password;
    persistenceSchema.provider = domainEntity.provider;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;
    persistenceSchema.deletedAt = domainEntity.deletedAt;

    return persistenceSchema;
  }
}
