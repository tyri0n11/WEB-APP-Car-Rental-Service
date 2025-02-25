import { PartialType } from '@nestjs/swagger';
import { CreateCarRequestDTO } from './create.request.dto';

export class UpdateCarRequestDTO extends PartialType(CreateCarRequestDTO) {}
