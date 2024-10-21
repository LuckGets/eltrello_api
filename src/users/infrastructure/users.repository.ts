import { IPaginationOptions, NullableType } from '../../utils/types';
import { User } from '../domain/user';
import { SortUsersDto } from '../dto/query-user.dto';

export abstract class UserRepository {
  abstract create(
    data: Omit<
      User,
      'id' | 'provider' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
  ): Promise<User>;

  abstract findByEmail(email: User['email']): Promise<NullableType<User>>;

  abstract findById(id: User['id']): Promise<NullableType<User>>;

  abstract findManyWithPagination(
    sortOptions?: SortUsersDto[],
    paginationOption?: IPaginationOptions,
  ): Promise<NullableType<Array<User>>>;
}
