import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../services/database/database.service';

@Injectable()
export class PrismaService extends DatabaseService {}
