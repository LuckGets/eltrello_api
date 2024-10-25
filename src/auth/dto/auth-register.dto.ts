import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthRegisterDto {
  @ApiProperty({ example: 'johndoe@mail.com', type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', type: String })
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
