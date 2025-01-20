import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfDto } from './dto/create-of.dto';
import { UpdateOfDto } from './dto/update-of.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class OfService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createOfDto: CreateOfDto) {
    try {
      const lastOf = await this.prisma.ordreFabrication.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (lastOf && lastOf.Numero === createOfDto.Numero) {
        await this.prisma.ordreFabrication.update({
          where: {
            Id: lastOf.Id,
          },
          data: {
            ...createOfDto,
            Of_Prod: true,
          },
        });
      } else {
        await this.prisma.ordreFabrication.create({
          data: {
            ...createOfDto,
            Of_Prod: true,
          },
        });
      }

      await this.prisma.ordreFabrication.updateMany({
        where: {
          Of_Prod: true,
          NOT: {
            Numero: createOfDto.Numero,
          },
        },
        data: {
          Of_Prod: false,
        },
      });

      await axios.post(
        `http://localhost:5000/reset_quantity/${process.env.MACHINE}`,
      );
    } catch (error) {
      throw new InternalServerErrorException(`Error: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.ordreFabrication.findMany();
    } catch (error) {
      throw new InternalServerErrorException(`Error: ${error.message}`);
    }
  }

  async findOne(Numero: string) {
    try {
      const of = await this.prisma.ordreFabrication.findFirst({
        where: {
          Numero,
        },
      });

      if (!of) {
        throw new NotFoundException(`Of with Numero ${Numero} not found`);
      }

      return of;
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(`Error: ${error.message}`);
    }
  }

  async update(id: number, updateOfDto: UpdateOfDto) {
    try {
      const updatedOf = await this.prisma.ordreFabrication.update({
        where: {
          Id: id,
        },
        data: updateOfDto,
      });

      if (!updatedOf) {
        throw new NotFoundException(`Of with Id ${id} not found`);
      }
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(`Error: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const of = await this.prisma.ordreFabrication.findUnique({
        where: {
          Id: id,
        },
      });

      if (!of) {
        throw new NotFoundException(`Of with Id ${id} not found`);
      }

      await this.prisma.ordreFabrication.update({
        where: {
          Id: id,
        },
        data: {
          deleted: true,
          Of_Prod: false,
        },
      });
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(`Error: ${error.message}`);
    }
  }
}
