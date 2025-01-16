import { Injectable } from '@nestjs/common';

@Injectable()
export class MachineService {
  findAll() {
    return `This action returns all machine`;
  }
}
