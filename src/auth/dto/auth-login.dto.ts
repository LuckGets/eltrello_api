import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Min } from 'class-validator';

export class AuthUserLoginDto {
  @ApiProperty({ example: 'johndoe@mail.com', type: String })
  @IsEmail()
  email: string;

  @ApiProperty()
  @Min(6)
  password: string;
}
