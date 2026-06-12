import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { LocalStorageService } from '../infrastructure/local-storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly localStorage: LocalStorageService) {}

  @Get('local/:key')
  serveLocal(@Param('key') key: string, @Res() response: Response) {
    try {
      return response.sendFile(this.localStorage.resolveKey(decodeURIComponent(key)));
    } catch {
      throw new NotFoundException('File not found');
    }
  }
}
