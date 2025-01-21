import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { ArretService } from './arret.service';
import { UpdateArretDto } from './dto/update-arret.dto';

@Controller('arret')
export class ArretController {
  constructor(private readonly arretService: ArretService) {}

  @Get()
  findAll() {
    return this.arretService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArretDto: UpdateArretDto) {
    return this.arretService.update(+id, updateArretDto);
  }
}
