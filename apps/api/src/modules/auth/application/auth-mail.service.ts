import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class AuthMailService {
  private readonly logger = new Logger(AuthMailService.name);

  constructor(private readonly config: ConfigService) {}

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    await this.sendAuthEmail({
      email,
      subject: 'Reset your TheWedding password',
      title: 'Reset your password',
      intro: 'We received a request to reset your TheWedding account password.',
      actionLabel: 'Reset password',
      actionUrl: this.buildAppUrl('/reset-password', token),
      fallbackText: 'If you did not request this, you can ignore this email.',
    });
  }

  async sendEmailVerificationEmail(email: string, token: string): Promise<void> {
    await this.sendAuthEmail({
      email,
      subject: 'Verify your TheWedding email',
      title: 'Verify your email',
      intro: 'Please verify your email address to finish setting up your TheWedding account.',
      actionLabel: 'Verify email',
      actionUrl: this.buildAppUrl('/verify-email', token),
      fallbackText: 'If you did not create this account, you can ignore this email.',
    });
  }

  private async sendAuthEmail(input: {
    email: string;
    subject: string;
    title: string;
    intro: string;
    actionLabel: string;
    actionUrl: string;
    fallbackText: string;
  }): Promise<void> {
    if (!this.isSmtpConfigured()) {
      return;
    }

    try {
      const transporter = nodemailer.createTransport({
        host: this.config.get<string>('SMTP_HOST', 'localhost'),
        port: this.config.get<number>('SMTP_PORT', 1025),
        secure: this.config.get<boolean>('SMTP_SECURE', false),
        auth: {
          user: this.config.get<string>('SMTP_USER', ''),
          pass: this.config.get<string>('SMTP_PASSWORD', ''),
        },
      });

      await transporter.sendMail({
        from: this.config.get<string>('SMTP_FROM', 'TheWedding <no-reply@localhost>'),
        to: input.email,
        subject: input.subject,
        text: [
          input.title,
          '',
          input.intro,
          '',
          `${input.actionLabel}: ${input.actionUrl}`,
          '',
          input.fallbackText,
        ].join('\n'),
        html: `
          <h1>${escapeHtml(input.title)}</h1>
          <p>${escapeHtml(input.intro)}</p>
          <p><a href="${escapeAttribute(input.actionUrl)}">${escapeHtml(input.actionLabel)}</a></p>
          <p>${escapeHtml(input.fallbackText)}</p>
        `,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send auth email to ${input.email}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private isSmtpConfigured(): boolean {
    return (
      this.config.get<string>('MAIL_PROVIDER', 'smtp') === 'smtp' &&
      Boolean(this.config.get<string>('SMTP_HOST')) &&
      Boolean(this.config.get<string>('SMTP_USER')) &&
      Boolean(this.config.get<string>('SMTP_PASSWORD'))
    );
  }

  private buildAppUrl(pathname: string, token: string): string {
    const appUrl = new URL(this.config.get<string>('APP_URL', 'http://localhost:3000'));
    appUrl.pathname = pathname;
    appUrl.search = '';
    appUrl.searchParams.set('token', token);

    return appUrl.toString();
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}
