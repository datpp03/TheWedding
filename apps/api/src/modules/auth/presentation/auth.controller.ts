import { Controller, Get } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  @Public()
  @Get('capabilities')
  capabilities() {
    return {
      module: 'auth',
      phase: '2-planned',
      capabilities: [
        'register',
        'login',
        'logout',
        'refresh',
        'forgot-password',
        'reset-password',
        'verify-email',
        'sessions',
      ],
    };
  }
}
