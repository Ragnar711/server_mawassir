import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RealtimeService {
  constructor(private readonly prisma: PrismaService) {}
  async findOne() {
    try {
      return await this.prisma.historiqueTemp.findFirst({
        orderBy: {
          Date: 'desc',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error: ${error.message}`);
    }
  }
}
