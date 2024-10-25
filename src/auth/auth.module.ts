import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/users.module';
import { CryptoModule } from '../utils';

@Module({
  imports: [JwtModule.register({}), UserModule, CryptoModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
