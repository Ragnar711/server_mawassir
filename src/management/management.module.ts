import { Module } from '@nestjs/common';
import { ManagementService } from './management.service';
import { ManagementController } from './management.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ManagementController],
  providers: [ManagementService],
  imports: [PrismaModule],
})
export class ManagementModule {}
