export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');

export interface PasswordHasher {
  hash(plainTextPassword: string): Promise<string>;
  verify(hash: string, plainTextPassword: string): Promise<boolean>;
}
