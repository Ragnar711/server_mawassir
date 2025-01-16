import { Controller, Get, Param } from '@nestjs/common';
import { HistoriqueService } from './historique.service';

@Controller('historique')
export class HistoriqueController {
  constructor(private readonly historiqueService: HistoriqueService) {}

  @Get(':from/:to')
  findAll(@Param('from') from: Date, @Param('to') to: Date) {
    return this.historiqueService.findAll(from, to);
  }
}
