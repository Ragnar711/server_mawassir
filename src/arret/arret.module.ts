import { Module } from '@nestjs/common';
import { ArretService } from './arret.service';
import { ArretController } from './arret.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ArretController],
  providers: [ArretService],
  imports: [PrismaModule],
})
export class ArretModule {}
