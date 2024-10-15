import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AuthProvidersEnum } from '../../auth/auth-providers.enum';
import { DatabaseConfig, databaseConfig } from '../../database';

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number;

export class User {
  @ApiProperty({
    type: idType,
  })
  id: number | string;

  @ApiProperty({
    type: String,
  })
  username: string;

  @ApiProperty({
    type: String,
    example: 'johndoe@mail.com',
  })
  email: string;
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  @ApiProperty({
    type: AuthProvidersEnum,
    example: 'google',
  })
  provider: AuthProvidersEnum;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt?: Date | null;
}
