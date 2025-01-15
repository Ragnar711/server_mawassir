import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DechetService } from './dechet.service';
import { CreateDechetDto } from './dto/create-dechet.dto';
import { UpdateDechetDto } from './dto/update-dechet.dto';

@Controller('dechet')
export class DechetController {
  constructor(private readonly dechetService: DechetService) {}

  @Post()
  create(@Body() createDechetDto: CreateDechetDto) {
    return this.dechetService.create(createDechetDto);
  }

  @Get()
  findAll() {
    return this.dechetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dechetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDechetDto: UpdateDechetDto) {
    return this.dechetService.update(+id, updateDechetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dechetService.remove(+id);
  }
}
