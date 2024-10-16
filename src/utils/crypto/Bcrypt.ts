import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export abstract class CryptoService {
  abstract hash(password: string): Promise<string>;
  abstract compare(password: string, hashedPassword: string): Promise<boolean>;
}

export class BcryptService implements CryptoService {
  private salt: number = Number(process.env.BCRYPT_SALT);

  public hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt);
  }

  public compare(
    passwordToCompare: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(passwordToCompare, hashedPassword);
  }
}
