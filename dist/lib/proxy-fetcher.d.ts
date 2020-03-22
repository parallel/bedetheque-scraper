export interface Proxy {
    host: string;
    port: number;
}
export declare class ProxyFetcher {
    static getProxyList(timeout?: number): Promise<Proxy[]>;
}
