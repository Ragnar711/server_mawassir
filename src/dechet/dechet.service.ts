import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDechetDto } from './dto/create-dechet.dto';
import { UpdateDechetDto } from './dto/update-dechet.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { getPoste } from 'src/utils';

@Injectable()
export class DechetService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createDechetDto: CreateDechetDto) {
    try {
      const of = await this.prisma.ordreFabrication.findFirst({
        where: { Of_Prod: true },
      });

      if (!of) {
        throw new NotFoundException('Aucune ordre de fabrication en cours');
      }

      await this.prisma.dechet.create({
        data: {
          ...createDechetDto,
          Of: of.Numero,
          Poste: getPoste(),
        },
      });
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(`Error: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.dechet.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const dechet = await this.prisma.dechet.findUnique({
        where: {
          Id: id,
        },
      });

      if (!dechet) {
        throw new NotFoundException(`Dechet #${id} introuvable`);
      }

      return dechet;
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(`Error: ${error.message}`);
    }
  }

  async update(id: number, updateDechetDto: UpdateDechetDto) {
    try {
      const dechet = await this.prisma.dechet.findUnique({
        where: {
          Id: id,
        },
      });

      if (!dechet) {
        throw new NotFoundException(`Dechet #${id} introuvable`);
      }

      await this.prisma.dechet.update({
        where: {
          Id: id,
        },
        data: updateDechetDto,
      });
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(`Error: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const dechet = await this.prisma.dechet.findUnique({
        where: {
          Id: id,
        },
      });

      if (!dechet) {
        throw new NotFoundException(`Dechet #${id} introuvable`);
      }

      await this.prisma.dechet.update({
        where: {
          Id: id,
        },
        data: {
          deleted: true,
        },
      });
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(`Error: ${error.message}`);
    }
  }
}
