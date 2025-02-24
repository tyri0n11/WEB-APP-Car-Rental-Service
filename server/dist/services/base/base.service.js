"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const nestjs_prisma_pagination_1 = require("@nodeteam/nestjs-prisma-pagination");
const paginate = (0, nestjs_prisma_pagination_1.paginator)({
    page: 1,
    perPage: 10,
});
class BaseService {
    constructor(prisma, model, responseDto) {
        this.prisma = prisma;
        this.model = model;
        this.responseDto = responseDto;
    }
    async findMany(args) {
        const { filter, options } = args;
        const data = await this.prisma[this.model].findMany({
            where: filter,
            ...options,
        });
        return data.map((item) => new this.responseDto(item));
    }
    async findManyWithPagination({ filter, orderBy, page, perPage, options, }) {
        const response = await paginate(this.prisma[this.model], {
            where: filter,
            orderBy,
            ...options,
        }, {
            page,
            perPage,
        });
        return {
            ...response.meta,
            data: response.data.map((item) => new this.responseDto(item)),
        };
    }
    async findOne(filter, options) {
        const entity = await this.prisma[this.model].findUnique({
            where: filter,
            ...options,
        });
        if (!entity) {
            return null;
        }
        return new this.responseDto(entity);
    }
    async create(data, options) {
        return new this.responseDto(await this.prisma[this.model].create({
            data,
            ...options,
        }));
    }
    async update(filter, data, options) {
        return new this.responseDto(await this.prisma[this.model].update({
            where: filter,
            data,
            ...options,
        }));
    }
    async remove(filter) {
        return new this.responseDto(this.prisma[this.model].delete({
            where: filter,
        }));
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map