import { AuthProvidersEnum } from 'src/auth/auth-providers.enum';

export class DomainEntityDto {
  id?: number | string;
  username: string;

  email: string;
  password: string;

  provider: AuthProvidersEnum;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date | null;
}
