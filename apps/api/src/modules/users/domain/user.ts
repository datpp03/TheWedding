export type UserStatus = 'active' | 'locked' | 'disabled' | 'pending_verification';

export class User {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly displayName: string,
    readonly status: UserStatus,
    readonly emailVerifiedAt: Date | null,
  ) {}

  canLogin() {
    return this.status === 'active' || this.status === 'pending_verification';
  }
}
