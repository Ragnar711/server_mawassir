import { Injectable } from '@nestjs/common';

@Injectable()
export class ManagementService {
  findAll() {
    return `This action returns all management`;
  }
}
