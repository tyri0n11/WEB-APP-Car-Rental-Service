interface ApiPostOptions {
    responseMessage?: string;
    path: string;
    code?: number;
}
export declare function ApiPost(opt: ApiPostOptions): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export {};
