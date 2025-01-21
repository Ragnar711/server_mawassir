import { PartialType } from '@nestjs/swagger';
import { CreateArretDto } from './create-arret.dto';

export class UpdateArretDto extends PartialType(CreateArretDto) {}
