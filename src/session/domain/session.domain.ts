import { ApiProperty } from '@nestjs/swagger';
import { DatabaseConfig, databaseConfig } from '../../database';
import { User } from '../../users';

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number;

export class Session {
  @ApiProperty({
    type: idType,
  })
  id: number | string;
  @ApiProperty({
    type: User,
  })
  user: User;
  @ApiProperty({
    type: String,
  })
  hash: string;
  @ApiProperty({
    type: Date,
  })
  createdAt: Date;
  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;

  @ApiProperty({
    type: Date,
  })
  deletedAt?: Date;
}
