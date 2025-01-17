import { Controller, Get, Param } from '@nestjs/common';
import { ManagementService } from './management.service';

@Controller('management')
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @Get(':from/:to')
  findAll(@Param('from') from: Date, @Param('to') to: Date) {
    return this.managementService.findAll(from, to);
  }
}
