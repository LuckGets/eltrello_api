import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users';

export class LoginResponseDto {
  @ApiProperty({ type: String })
  token: string;

  @ApiProperty({ type: String })
  refreshToken: string;

  @ApiProperty({
    type: User,
  })
  user: User;
}
