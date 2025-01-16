import { Module } from '@nestjs/common';
import { HistoriqueService } from './historique.service';
import { HistoriqueController } from './historique.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [HistoriqueController],
  providers: [HistoriqueService],
  imports: [PrismaModule],
})
export class HistoriqueModule {}
