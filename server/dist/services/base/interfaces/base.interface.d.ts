export interface BaseServiceInterface<T> {
    findMany(args?: {
        filter?: any;
        options?: any;
    }): Promise<T[]>;
    findManyWithPagination(filter?: any, orderBy?: any, page?: any, perPage?: any, options?: any): Promise<any>;
    findOne(filter: any): Promise<T>;
    create(data: any): Promise<T>;
    update(filter: any, data: any): Promise<T>;
    remove(filter: any): Promise<T>;
}
