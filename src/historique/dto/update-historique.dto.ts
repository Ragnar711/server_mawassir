import { PartialType } from '@nestjs/swagger';
import { CreateHistoriqueDto } from './create-historique.dto';

export class UpdateHistoriqueDto extends PartialType(CreateHistoriqueDto) {}
