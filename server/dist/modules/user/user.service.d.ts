import { BaseService } from '@/services/base/base.service';
import { User } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
export declare class UserService extends BaseService<User> {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    findByEmail(email: string): Promise<any>;
    findById(id: string): Promise<any>;
}
