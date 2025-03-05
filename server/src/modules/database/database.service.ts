import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  constructor(private readonly configService: ConfigService) {
    super();
  }
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Connected to database successfully');
      await this.createAdminAccount();
    } catch (error) {
      this.logger.error('Failed to initialzie the database: ', error);
      throw new InternalServerErrorException(error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'test') return;
    const models = Reflect.ownKeys(this).filter(
      (key) =>
        key[0] !== '_' &&
        typeof key === 'string' &&
        /^[a-z]/.test(key) &&
        typeof this[key].deleteMany === 'function',
    );

    return Promise.all(
      models.map((model) => {
        return this[model].deleteMany({});
      }),
    );
  }

  async createAdminAccount() {
    const existedAdmin = await this.user.findFirst({
      where: {
        role: 'ADMIN',
      },
    });
    if (existedAdmin) {
      this.logger.log('Admin account is found');
      return;
    }
    this.logger.error('Admin account is not found. Creating admin account...');
    const plainPassword = this.configService.get<string>('ADMIN_PASSWORD');
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    await this.user.create({
      data: {
        firstName: 'admin',
        lastName: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        isVerified: true,
        role: 'ADMIN',
      },
    });
    this.logger.log('Created admin account successfully');
  }
}
