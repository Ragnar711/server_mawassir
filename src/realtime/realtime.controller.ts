import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RealtimeService } from './realtime.service';
import { CreateRealtimeDto } from './dto/create-realtime.dto';
import { UpdateRealtimeDto } from './dto/update-realtime.dto';

@Controller('realtime')
export class RealtimeController {
  constructor(private readonly realtimeService: RealtimeService) {}

  @Post()
  create(@Body() createRealtimeDto: CreateRealtimeDto) {
    return this.realtimeService.create(createRealtimeDto);
  }

  @Get()
  findAll() {
    return this.realtimeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.realtimeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRealtimeDto: UpdateRealtimeDto) {
    return this.realtimeService.update(+id, updateRealtimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.realtimeService.remove(+id);
  }
}
