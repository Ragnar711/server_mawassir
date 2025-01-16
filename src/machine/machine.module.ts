import { Module } from '@nestjs/common';
import { MachineService } from './machine.service';
import { MachineController } from './machine.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [MachineController],
  providers: [MachineService],
  imports: [PrismaModule],
})
export class MachineModule {}
