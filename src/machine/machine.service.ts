import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import { Machine } from './entities/machine.entity';

const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

@Injectable()
export class MachineService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    try {
      const OF = await this.prisma.ordreFabrication.findFirst({
        where: { Of_Prod: true },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!OF) {
        return [];
      }

      const KPIs = await this.prisma.historiqueTemp.findFirst({
        select: {
          TP: true,
          TD: true,
          TQ: true,
          Debit: true,
          VE: true,
          VT: true,
          PM: true,
          QP: true,
        },
        where: { Date: { gte: last24Hours } },
        orderBy: {
          Date: 'desc',
        },
      });

      const QNC = await this.prisma.nonConforme.aggregate({
        _sum: { Quantite: true },
        where: { Of: OF.Numero },
      });

      const QD = await this.prisma.dechet.aggregate({
        _sum: { Quantite: true },
        where: { Of: OF.Numero },
      });

      const data: Machine = {
        KPIs: {
          TD: KPIs?.TD ?? 0,
          TP: KPIs?.TP ?? 0,
          TQ: KPIs?.TQ ?? 0,
          TRS: ((KPIs?.TP ?? 0) * (KPIs?.TQ ?? 0) * (KPIs?.TD ?? 0)) / 10000,
          historique: await this.getKPIsChart(),
        },

        OF: {
          NOF: OF?.Numero ?? '',
          Article: OF?.Article ?? '',
          QO: OF?.Quantite_Objectif ?? 0,
          QP: KPIs?.QP ?? 0,
          QNC: QNC._sum.Quantite,
          QD: QD._sum.Quantite,
          Debit: OF?.Debit ?? 0,
        },

        Params: {
          Debit: KPIs?.Debit ?? 0,
          VE: KPIs?.VE ?? 0,
          VT: KPIs?.VT ?? 0,
          PM: KPIs?.PM ?? 0,
        },

        ParetoNC: await this.getParetoNC(OF.Numero),
        ParetoDechet: await this.getParetoDechet(OF.Numero),
        ParetoArret: await this.getParetoArret(),

        historique: await this.getHistorique(),
      };

      return data;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while fetching all machines: ${error.message}`,
      );
    }
  }

  async getKPIsChart() {
    try {
      const historique = await this.prisma.historique.findMany({
        select: {
          Date: true,
          TD: true,
          TP: true,
          TQ: true,
        },
        orderBy: {
          Date: 'desc',
        },
        take: 7,
      });

      if (!historique) {
        return [];
      }

      const groupedData: {
        [hour: string]: {
          count: number;
          TD: number;
          TP: number;
          TQ: number;
        };
      } = historique.reduce(
        (
          acc: {
            [hour: string]: {
              count: number;
              TD: number;
              TP: number;
              TQ: number;
            };
          },
          curr,
        ) => {
          const hour = curr.Date.toString();
          if (!acc[hour]) {
            acc[hour] = { count: 0, TD: 0, TP: 0, TQ: 0 };
          }
          acc[hour].count += 1;
          acc[hour].TD += curr?.TD ?? 0;
          acc[hour].TP += curr?.TP ?? 0;
          acc[hour].TQ += curr?.TQ ?? 0;
          return acc;
        },
        {},
      );

      const historiqueKPIs = Object.keys(groupedData).map((hour) => {
        const data = groupedData[hour];
        return {
          Date: new Date(hour).toISOString().slice(11, 13) + 'h',
          TD: data.TD / data.count,
          TP: data.TP / data.count,
          TQ: data.TQ / data.count,
          TRS:
            ((data.TP / data.count) *
              (data.TQ / data.count) *
              (data.TD / data.count)) /
            10000,
        };
      });

      return historiqueKPIs;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while fetching KPIs chart: ${error.message}`,
      );
    }
  }

  async getParetoNC(NOF: string) {
    try {
      const nc = await this.prisma.nonConforme.findMany({
        where: {
          Date: { gte: last24Hours },
          Of: NOF,
        },
      });

      if (!nc) {
        return [];
      }

      const quantiteByType = nc.reduce(
        (acc, nc) => {
          const type = nc?.Type ?? '';
          if (!acc[type]) {
            acc[type] = 0;
          }
          acc[type] += nc?.Quantite ?? 0;
          return acc;
        },
        {} as Record<string, number>,
      );

      return Object.entries(quantiteByType)
        .map(([Type, Quantite]) => ({ Type, Quantite }))
        .sort((a, b) => b.Quantite - a.Quantite);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while fetching Pareto NC: ${error.message}`,
      );
    }
  }

  async getParetoDechet(NOF: string) {
    try {
      const dechet = await this.prisma.dechet.findMany({
        where: {
          Date: { gte: last24Hours },
          Of: NOF,
        },
      });

      if (!dechet) {
        return [];
      }

      const quantiteByType = dechet.reduce(
        (acc, dechet) => {
          const type = dechet?.Type ?? '';
          if (!acc[type]) {
            acc[type] = 0;
          }
          acc[type] += dechet?.Quantite ?? 0;
          return acc;
        },
        {} as Record<string, number>,
      );

      return Object.entries(quantiteByType)
        .map(([Type, Quantite]) => ({ Type, Quantite }))
        .sort((a, b) => b.Quantite - a.Quantite);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while fetching Pareto Dechet: ${error.message}`,
      );
    }
  }

  async getParetoArret() {
    try {
      const arrets = await this.prisma.arret.findMany({
        where: { Date_Debut: { gte: last24Hours } },
      });

      if (!arrets) {
        return [];
      }

      const groupedByCause = arrets.reduce(
        (acc, arret) => {
          if (arret?.Cause && arret?.Duree !== undefined) {
            const cause = arret.Cause;
            if (!acc[cause]) {
              acc[cause] = 0;
            }
            acc[cause] += arret?.Duree ?? 0;
          }
          return acc;
        },
        {} as Record<string, number>,
      );

      const paretoArret = Object.entries(groupedByCause)
        .map(([Cause, Duree]) => ({ Cause, Duree }))
        .sort((a, b) => b.Duree - a.Duree);

      return paretoArret;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while fetching Pareto Arret: ${error.message}`,
      );
    }
  }

  async getHistorique() {
    try {
      const res = await axios.get(
        `http://localhost:${process.env.PORT}/historique/${last24Hours.toISOString()}/${new Date().toISOString()}`,
      );

      return res.data;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while fetching historique: ${error.message}`,
      );
    }
  }
}
