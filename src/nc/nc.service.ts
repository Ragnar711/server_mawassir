import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNcDto } from './dto/create-nc.dto';
import { UpdateNcDto } from './dto/update-nc.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { getPoste } from 'src/utils';

@Injectable()
export class NcService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createNcDto: CreateNcDto) {
    try {
      const of = await this.prisma.ordreFabrication.findFirst({
        where: { Of_Prod: true },
      });

      await this.prisma.nonConforme.create({
        data: {
          ...createNcDto,
          Of: of?.Numero ?? null,
          Poste: getPoste(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.nonConforme.findMany({
        where: { deleted: false },
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
      const nc = await this.prisma.nonConforme.findUnique({
        where: {
          Id: id,
        },
      });

      if (!nc) {
        throw new NotFoundException(`Non-conformite #${id} introuvable`);
      }

      return nc;
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(`Error: ${error.message}`);
    }
  }

  async update(id: number, updateNcDto: UpdateNcDto) {
    try {
      const nc = await this.prisma.nonConforme.findUnique({
        where: {
          Id: id,
        },
      });

      if (!nc) {
        throw new NotFoundException(`Non-conforme #${id} introuvable`);
      }

      await this.prisma.nonConforme.update({
        where: {
          Id: id,
        },
        data: updateNcDto,
      });
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(`Error: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const nc = await this.prisma.nonConforme.findUnique({
        where: {
          Id: id,
        },
      });

      if (!nc) {
        throw new NotFoundException(`Non-conforme #${id} introuvable`);
      }

      await this.prisma.nonConforme.update({
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
