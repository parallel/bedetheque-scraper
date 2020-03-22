/// <reference types="cheerio" />
import { Proxy } from "./proxy-fetcher";
export declare class Utils {
    static requestWithProxy(urlRaw: string, proxy: Proxy): Promise<CheerioStatic>;
    static promiseWithTimeout(promise: Promise<any>, ms: number): Promise<any>;
    static urlToSerieID(url: string): number;
    static urlToAuthorID(url: string): number;
}
