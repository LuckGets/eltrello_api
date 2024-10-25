import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, Min } from 'class-validator';
import { AuthProvidersEnum } from '../../auth/auth-providers.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ example: 'johndoe@mail.com', type: String })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Min(6)
  password?: string;

  provider?: AuthProvidersEnum;

  @ApiPropertyOptional({ example: 'John Doe', type: String })
  username?: string;
}
