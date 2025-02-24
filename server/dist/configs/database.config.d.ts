export interface IDatabaseConfig {
    host: string;
    port: number;
    uri: string;
}
export declare const databaseConfig: () => {
    database: {
        host: string;
        port: number;
        uri: string;
    };
};
