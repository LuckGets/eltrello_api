import { Module } from '@nestjs/common';
import { BcryptService, CryptoService } from './Bcrypt';

@Module({
  providers: [
    {
      provide: CryptoService,
      useClass: BcryptService,
    },
  ],
  exports: [CryptoService],
})
export class CryptoModule {}
