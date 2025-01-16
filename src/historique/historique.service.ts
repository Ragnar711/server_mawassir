import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { formatTime } from 'src/utils';
import { Historique } from './entities/historique.entity';

interface GroupedData {
  [key: string]: {
    date: string;
    TRS: number;
    TP: number;
    TD: number;
    TQ: number;
    QP: number;
    QNC: number;
    QD: number;
    debit: number;
    NOF: string | null;
    arrets: number;
    count: number;
  };
}

@Injectable()
export class HistoriqueService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(from: Date, to: Date) {
    try {
      const [historique, nc, dechet, arret] = await Promise.all([
        this.prisma.historique.findMany({
          where: {
            Date: {
              gte: from,
              lte: to,
            },
          },
          orderBy: {
            Date: 'desc',
          },
        }),

        this.prisma.nonConforme.findMany({
          where: {
            Date: {
              gte: from,
              lte: to,
            },
          },
          orderBy: {
            Date: 'desc',
          },
        }),

        this.prisma.dechet.findMany({
          where: {
            Date: {
              gte: from,
              lte: to,
            },
          },
          orderBy: {
            Date: 'desc',
          },
        }),

        this.prisma.arret.findMany({
          where: {
            Date_Debut: {
              gte: from,
              lte: to,
            },
          },
          orderBy: {
            Date_Debut: 'desc',
          },
        }),
      ]);

      const groupedData: GroupedData = historique.reduce(
        (acc: GroupedData, row) => {
          const hour = row.Date.getHours();
          const key = `${row.Poste} / ${hour}h`;
          const date = row.Date.toISOString().split('T')[0];

          if (!acc[key]) {
            acc[key] = {
              date,
              TP: 0,
              TQ: 0,
              TD: 0,
              TRS: 0,
              QP: 0,
              QNC: 0,
              QD: 0,
              debit: 0,
              NOF: '',
              arrets: 0,
              count: 0,
            };
          }

          acc[key].TP += row.TP;
          acc[key].TQ += row.TQ;
          acc[key].TD += row.TD;
          acc[key].QP += row.QP;
          acc[key].debit += row.Debit;
          acc[key].NOF = row.Of;
          acc[key].count += 1;

          return acc;
        },
        {},
      );

      const groupedNC = nc.reduce((acc, row) => {
        const key = `${row.Poste} / ${row.Date.getHours()}h`;

        if (!acc[key]) {
          acc[key] = 0;
        }

        acc[key] += row.Quantite;

        return acc;
      }, {});

      const groupedDechet = dechet.reduce((acc, row) => {
        const key = `${row.Poste} / ${row.Date.getHours()}h`;

        if (!acc[key]) {
          acc[key] = 0;
        }

        acc[key] += row.Quantite;

        return acc;
      }, {});

      const groupedArret = arret.reduce((acc, row) => {
        const key = `${row.Poste} / ${row.Date_Debut.getHours()}h`;

        if (!acc[key]) {
          acc[key] = 0;
        }

        acc[key] += row.Duree;

        return acc;
      }, {});

      Object.keys(groupedNC).forEach(([key, value]) => {
        if (groupedData[key]) {
          groupedData[key].QNC += Number(value);
        }
      });

      Object.keys(groupedDechet).forEach(([key, value]) => {
        if (groupedData[key]) {
          groupedData[key].QD += Number(value);
        }
      });

      Object.keys(groupedArret).forEach(([key, value]) => {
        if (groupedData[key]) {
          groupedData[key].arrets = Number(value);
        }
      });

      const result: Historique[] = Object.entries(groupedData).map(
        ([key, value], index) => ({
          key: index + 1,
          Date: value.date,
          'Post/heure': key,
          'N°OF': value.NOF,
          'Qté Prod OK': value.QP ?? 0,
          'Qté NC': value.QNC ?? 0,
          'Qté Déchet': value.QD ?? 0,
          Débit: value.debit,
          TRS:
            ((value.TD / value.count) *
              (value.TP / value.count) *
              (value.TQ / value.count)) /
            10000,
          TD: value.TD,
          TP: value.TP,
          TQ: value.TQ,
          Arrêts: formatTime(value.arrets),
        }),
      );

      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while fetching historique: ${error.message}`,
      );
    }
  }
}
