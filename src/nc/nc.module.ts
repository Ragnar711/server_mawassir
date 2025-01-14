import { Module } from '@nestjs/common';
import { NcService } from './nc.service';
import { NcController } from './nc.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [NcController],
  providers: [NcService],
  imports: [PrismaModule],
})
export class NcModule {}
