import { Module } from '@nestjs/common';
import { RealtimeService } from './realtime.service';
import { RealtimeController } from './realtime.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RealtimeController],
  providers: [RealtimeService],
  imports: [PrismaModule],
})
export class RealtimeModule {}
