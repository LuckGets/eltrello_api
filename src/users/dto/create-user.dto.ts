import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { AuthProvidersEnum } from 'src/auth/auth-providers.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'John doe', type: String })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'johndoe@mail.com', type: String })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  provider?: AuthProvidersEnum | null;
}
