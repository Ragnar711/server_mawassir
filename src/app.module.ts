import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RealtimeModule } from './realtime/realtime.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [RealtimeModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
