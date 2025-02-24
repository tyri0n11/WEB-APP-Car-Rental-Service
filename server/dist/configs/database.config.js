"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const databaseConfig = () => ({
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        uri: process.env.DATABASE_URL,
    },
});
exports.databaseConfig = databaseConfig;
//# sourceMappingURL=database.config.js.map