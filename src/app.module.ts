import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RealtimeModule } from './realtime/realtime.module';
import { PrismaModule } from './prisma/prisma.module';
import { OfModule } from './of/of.module';

@Module({
  imports: [RealtimeModule, PrismaModule, OfModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
