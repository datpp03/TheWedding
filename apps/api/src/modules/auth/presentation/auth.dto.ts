import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @MaxLength(320)
  email!: string;

  @IsString()
  @MinLength(12)
  @MaxLength(128)
  password!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  displayName!: string;
}

export class LoginDto {
  @IsEmail()
  @MaxLength(320)
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password!: string;
}

export class RefreshDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  refreshToken?: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @MaxLength(320)
  email!: string;
}

export class ResetPasswordDto {
  @IsString()
  @MinLength(1)
  token!: string;

  @IsString()
  @MinLength(12)
  @MaxLength(128)
  password!: string;
}

export class VerifyEmailDto {
  @IsString()
  @MinLength(1)
  token!: string;
}

export class ResendVerificationDto {
  @IsEmail()
  @MaxLength(320)
  email!: string;
}

export class VerifyMfaEnrollmentDto {
  @IsString()
  @MinLength(1)
  enrollmentToken!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  code!: string;
}

export class MfaChallengeDto {
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  code!: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  challengeToken?: string;
}

export class DisableMfaDto {
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  code!: string;
}
