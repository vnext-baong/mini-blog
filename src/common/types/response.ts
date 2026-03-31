import { HttpStatus } from '@nestjs/common';

export class MessageResponse {
  statusCode?: HttpStatus;
  message?: string;
}
