import { HttpException, HttpStatus } from '@nestjs/common';

export class YelnurException extends HttpException {
  constructor() {
    super('YelnurException', HttpStatus.FORBIDDEN);
  }
}
