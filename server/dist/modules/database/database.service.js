"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DatabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
const client_1 = require("@prisma/client");
const config_1 = require("@nestjs/config");
let DatabaseService = DatabaseService_1 = class DatabaseService extends client_1.PrismaClient {
    constructor(configService) {
        super();
        this.configService = configService;
        this.logger = new common_1.Logger(DatabaseService_1.name);
    }
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Connected to database successfully');
            await this.createAdminAccount();
        }
        catch (error) {
            this.logger.error('Failed to initialzie the database: ', error);
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    async cleanDatabase() {
        if (process.env.NODE_ENV !== 'test')
            return;
        const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_' &&
            typeof key === 'string' &&
            /^[a-z]/.test(key) &&
            typeof this[key].deleteMany === 'function');
        return Promise.all(models.map((model) => {
            return this[model].deleteMany({});
        }));
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
        const plainPassword = this.configService.get('ADMIN_PASSWORD');
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
        this.logger.log('Create admin account successfully');
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = DatabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DatabaseService);
//# sourceMappingURL=database.service.js.map