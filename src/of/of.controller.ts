import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OfService } from './of.service';
import { CreateOfDto } from './dto/create-of.dto';
import { UpdateOfDto } from './dto/update-of.dto';

@Controller('of')
export class OfController {
  constructor(private readonly ofService: OfService) {}

  @Post()
  create(@Body() createOfDto: CreateOfDto) {
    return this.ofService.create(createOfDto);
  }

  @Get()
  findAll() {
    return this.ofService.findAll();
  }

  @Get(':numero')
  findOne(@Param('numero') numero: string) {
    return this.ofService.findOne(numero);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfDto: UpdateOfDto) {
    return this.ofService.update(+id, updateOfDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ofService.remove(+id);
  }
}
