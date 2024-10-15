import { User } from '../domain/user';

export abstract class UserRepository {
  abstract create(
    data: Omit<
      User,
      'id' | 'provider' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
  ): Promise<User>;
}
