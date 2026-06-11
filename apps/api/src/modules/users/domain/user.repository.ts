export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  findById(id: string): Promise<object | null>;
  findByEmail(email: string): Promise<object | null>;
}
