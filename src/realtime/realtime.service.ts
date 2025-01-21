import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Realtime } from './entities/realtime.entity';

@Injectable()
export class RealtimeService {
  constructor(private readonly prisma: PrismaService) {}
  async findOne() {
    try {
      const data = await this.prisma.historiqueTemp.findFirst({
        orderBy: {
          Date: 'desc',
        },
      });

      if (!data?.Of) {
        return {
          ...data,
          QO: 0,
          QNC: 0,
          QD: 0,
        } as Realtime;
      }

      const of = await this.prisma.ordreFabrication.findFirst({
        select: { Quantite_Objectif: true },
        where: { Numero: data.Of, Of_Prod: true },
      });

      const QNC = await this.prisma.nonConforme.aggregate({
        where: { Of: data.Of },
        _sum: { Quantite: true },
      });

      const QD = await this.prisma.dechet.aggregate({
        where: { Of: data.Of },
        _sum: { Quantite: true },
      });

      return {
        ...data,
        QO: of?.Quantite_Objectif ?? '',
        QNC: QNC._sum.Quantite ?? 0,
        QD: QD._sum.Quantite ?? 0,
      } as Realtime;
    } catch (error) {
      throw new InternalServerErrorException(`Error: ${error.message}`);
    }
  }
}
