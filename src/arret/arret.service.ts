import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateArretDto } from './dto/update-arret.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArretService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    try {
      return await this.prisma.arret.findMany();
    } catch (error) {
      throw new InternalServerErrorException(`Error: ${error.message}`);
    }
  }

  async update(id: number, updateArretDto: UpdateArretDto) {
    try {
      const arret = await this.prisma.arret.findUnique({
        where: {
          Id: id,
        },
      });

      if (!arret) {
        throw new NotFoundException(`Arret #${id} introuvable`);
      }

      await this.prisma.arret.update({
        where: {
          Id: id,
        },
        data: updateArretDto,
      });
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(`Error: ${error.message}`);
    }
  }
}
