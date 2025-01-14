import { PartialType } from '@nestjs/swagger';
import { CreateOfDto } from './create-of.dto';

export class UpdateOfDto extends PartialType(CreateOfDto) {
  Quantite_Objectif?: number;
  Debit?: number;
  Recette?: { name: string; percentage: number }[];
}
