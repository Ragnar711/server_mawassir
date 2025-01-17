import { Controller, Get } from '@nestjs/common';
import { MachineService } from './machine.service';

@Controller('machine')
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @Get()
  findAll() {
    return this.machineService.findAll();
  }
}
