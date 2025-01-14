import { Module } from '@nestjs/common';
import { OfService } from './of.service';
import { OfController } from './of.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [OfController],
  providers: [OfService],
  imports: [PrismaModule],
})
export class OfModule {}
