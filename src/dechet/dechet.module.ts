import { Module } from '@nestjs/common';
import { DechetService } from './dechet.service';
import { DechetController } from './dechet.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [DechetController],
  providers: [DechetService],
  imports: [PrismaModule],
})
export class DechetModule {}
