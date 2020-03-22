import { Proxy } from "./proxy-fetcher";
import { Serie } from "./serie";
import { Album } from "./album";
import { Author } from "./author";
export declare class Scraper {
    static getSeriesUrlFromLetter(letter: string, proxy?: Proxy): Promise<string[]>;
    static getAuthorsUrlFromLetter(letter: string, proxy?: Proxy): Promise<string[]>;
    static getSerie(url: string, proxy?: Proxy): Promise<{
        serie: Serie;
        albums: Album[];
    }>;
    static getAuthor(url: string, proxy?: Proxy): Promise<Author>;
}
