import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
} from 'date-fns';
import { Management } from './entities/management.entity';

interface GroupedData {
  [key: string]: {
    TRS: number;
    TP: number;
    TD: number;
    TQ: number;
    count: number;
  };
}

@Injectable()
export class ManagementService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(from: Date, to: Date) {
    try {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      const diffHours = differenceInHours(toDate, fromDate);
      const diffDays = differenceInDays(toDate, fromDate);
      const diffWeeks = differenceInWeeks(toDate, fromDate);
      const diffMonths = differenceInMonths(toDate, fromDate);

      let groupBy: 'hour' | 'day' | 'week' | 'month' | 'year';

      if (diffHours < 24) {
        groupBy = 'hour';
      } else if (diffDays <= 7) {
        groupBy = 'day';
      } else if (diffWeeks <= 4) {
        groupBy = 'week';
      } else if (diffMonths <= 12) {
        groupBy = 'month';
      } else {
        groupBy = 'year';
      }

      const [historique, arret, nc, dechet] = await Promise.all([
        this.prisma.historique.findMany({
          orderBy: { Date: 'desc' },
          where: { Date: { gte: fromDate, lte: toDate } },
        }),
        this.prisma.arret.findMany({
          where: { Date_Debut: { gte: fromDate, lte: toDate } },
          orderBy: { Date_Debut: 'desc' },
        }),
        this.prisma.nonConforme.findMany({
          where: { Date: { gte: fromDate, lte: toDate } },
          orderBy: { Date: 'desc' },
        }),
        this.prisma.dechet.findMany({
          where: { Date: { gte: fromDate, lte: toDate } },
          orderBy: { Date: 'desc' },
        }),
      ]);

      const arretDataMap: { [key: string]: number } = {};
      const ncDataMap: { [key: string]: number } = {};
      const dechetDataMap: { [key: string]: number } = {};

      arret.forEach((item) => {
        const Duree = item?.Duree ?? 0;
        const Cause = item?.Cause ?? '';

        if (!arretDataMap[Cause]) {
          arretDataMap[Cause] = 0;
        }

        arretDataMap[Cause] += Duree;
      });

      nc.forEach((item) => {
        const Quantite = item?.Quantite ?? 0;
        const Type = item?.Type ?? '';

        if (!ncDataMap[Type]) {
          ncDataMap[Type] = 0;
        }

        ncDataMap[Type] += Quantite;
      });

      dechet.forEach((item) => {
        const Quantite = item?.Quantite ?? 0;
        const Type = item?.Type ?? '';

        if (!dechetDataMap[Type]) {
          dechetDataMap[Type] = 0;
        }

        dechetDataMap[Type] += Quantite;
      });

      const arretData = Object.entries(arretDataMap).map(([Cause, Duree]) => ({
        Cause,
        Duree,
      }));

      const ncData = Object.entries(ncDataMap).map(([Type, Quantite]) => ({
        Type,
        Quantite,
      }));

      const dechetData = Object.entries(dechetDataMap).map(
        ([Type, Quantite]) => ({
          Type,
          Quantite,
        }),
      );

      arretData.sort((a, b) => b.Duree - a.Duree);
      ncData.sort((a, b) => b.Quantite - a.Quantite);
      dechetData.sort((a, b) => b.Quantite - a.Quantite);

      const groupedData: GroupedData = historique.reduce(
        (acc: GroupedData, row) => {
          let key: string;
          const date = row.Date;

          if (groupBy === 'hour') {
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(date.getDate()).padStart(
              2,
              '0',
            )} ${String(date.getHours()).padStart(2, '0')}:00`;
          } else if (groupBy === 'day') {
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(date.getDate()).padStart(2, '0')}`;
          } else if (groupBy === 'week') {
            const week = Math.ceil(date.getDate() / 7);
            key = `${date.getFullYear()}-W${String(week).padStart(2, '0')}`;
          } else if (groupBy === 'month') {
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
              2,
              '0',
            )}`;
          } else {
            key = `${date.getFullYear()}`;
          }

          if (!acc[key]) {
            acc[key] = {
              TRS: 0,
              TP: 0,
              TD: 0,
              TQ: 0,
              count: 0,
            };
          }

          acc[key].TD += row?.TD ?? 0;
          acc[key].TP += row?.TP ?? 0;
          acc[key].TQ += row?.TQ ?? 0;
          acc[key].count += 1;

          return acc;
        },
        {},
      );

      const result = Object.entries(groupedData).map(([key, value]) => ({
        Date: key,
        TD: value.count ? value.TD / value.count : 0,
        TP: value.count ? value.TP / value.count : 0,
        TQ: value.count ? value.TQ / value.count : 0,
        TRS: value.count
          ? ((value.TD / value.count) *
              (value.TP / value.count) *
              (value.TQ / value.count)) /
            10000
          : 0,
      }));

      const data: Management = {
        KPIs: result,
        NC: ncData,
        Dechet: dechetData,
        Arret: arretData,
      };

      return data;
    } catch (error) {
      throw new InternalServerErrorException(`Error: ${error.message}`);
    }
  }
}
