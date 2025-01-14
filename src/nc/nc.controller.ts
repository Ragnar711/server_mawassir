import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NcService } from './nc.service';
import { CreateNcDto } from './dto/create-nc.dto';
import { UpdateNcDto } from './dto/update-nc.dto';

@Controller('nc')
export class NcController {
  constructor(private readonly ncService: NcService) {}

  @Post()
  create(@Body() createNcDto: CreateNcDto) {
    return this.ncService.create(createNcDto);
  }

  @Get()
  findAll() {
    return this.ncService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ncService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNcDto: UpdateNcDto) {
    return this.ncService.update(+id, updateNcDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ncService.remove(+id);
  }
}
