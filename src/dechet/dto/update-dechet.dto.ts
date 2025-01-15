import { PartialType } from '@nestjs/swagger';
import { CreateDechetDto } from './create-dechet.dto';

export class UpdateDechetDto extends PartialType(CreateDechetDto) {}
