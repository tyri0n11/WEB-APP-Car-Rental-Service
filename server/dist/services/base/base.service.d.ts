import { DatabaseService } from '../../modules/database/database.service';
import { BaseServiceInterface } from './interfaces/base.interface';
export declare abstract class BaseService<T> implements BaseServiceInterface<T> {
    private prisma;
    private model;
    private responseDto;
    constructor(prisma: DatabaseService, model: string, responseDto: any);
    findMany(args?: {
        filter?: any;
        options?: any;
    }): Promise<any>;
    findManyWithPagination({ filter, orderBy, page, perPage, options, }: {
        filter?: any;
        orderBy?: any;
        page?: number;
        perPage?: number;
        options?: any;
    }): Promise<{
        data: any[];
        total: number;
        lastPage: number;
        currentPage: number;
        perPage: number;
        prev: number | null;
        next: number | null;
    }>;
    findOne(filter: any, options?: any): Promise<any>;
    create(data: any, options?: any): Promise<any>;
    update(filter: any, data: any, options?: any): Promise<any>;
    remove(filter: any): Promise<any>;
}
