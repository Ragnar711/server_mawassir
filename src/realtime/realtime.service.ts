import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Realtime } from './entities/realtime.entity';

@Injectable()
export class RealtimeService {
  constructor(private readonly prisma: PrismaService) {}
  async findOne() {
    try {
      const data: Realtime = await this.prisma.historiqueTemp.findFirst({
        orderBy: {
          Date: 'desc',
        },
      });

      return data;
    } catch (error) {
      throw new InternalServerErrorException(`Error: ${error.message}`);
    }
  }
}
