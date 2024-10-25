import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthProvidersEnum } from './auth-providers.enum';
import { CryptoService } from '../utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private cryptoService: CryptoService,
    private jwtService: JwtService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  public async register(authRegisterDto: AuthRegisterDto): Promise<void> {
    const user = await this.userService.create({
      ...authRegisterDto,
      email: authRegisterDto.email,
      provider: AuthProvidersEnum.email,
    });

    const hash = await this.jwtService.signAsync(
      {
        sub: user.id,
      },
      {
        secret: this.configService.getOrThrow('auth', { infer: true })
          .confirmEmailSecret,
        expiresIn: this.configService.getOrThrow('auth', { infer: true })
          .confirmEmailExpireTime,
      },
    );
  }

  public async validateLogin(): Promise<LoginResponseDto> {
    return new LoginResponseDto();
  }
}
