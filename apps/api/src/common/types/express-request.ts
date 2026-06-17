import type { Request } from 'express';
import type { AuthenticatedUser } from './authenticated-user';

export type RequestWithUser = Request & {
  correlationId?: string;
  user?: AuthenticatedUser;
};
