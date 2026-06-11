import { Injectable } from '@nestjs/common';
import argon2 from 'argon2';
import type { PasswordHasher } from '../domain/password-hasher';

@Injectable()
export class Argon2PasswordHasher implements PasswordHasher {
  hash(plainTextPassword: string): Promise<string> {
    return argon2.hash(plainTextPassword, {
      type: argon2.argon2id,
    });
  }

  verify(hash: string, plainTextPassword: string): Promise<boolean> {
    return argon2.verify(hash, plainTextPassword);
  }
}
