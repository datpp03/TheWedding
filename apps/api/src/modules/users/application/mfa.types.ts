export const MFA_METHODS = ['totp'] as const;

export type MfaMethod = (typeof MFA_METHODS)[number];

export type MfaEnrollment = {
  enabledAt: Date | null;
  method: MfaMethod;
  secretEncrypted: string | null;
};
