import { ApiProperty } from '@nestjs/swagger';
import { OrderQuery } from '../../utils/types';
import { User } from '../domain/user';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class SortUsersDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof User;

  @ApiProperty({
    type: OrderQuery,
  })
  @IsString()
  order: OrderQuery;
}
