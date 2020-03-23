/// <reference types="cheerio" />
import { ImageDetails } from "./image";
export declare class Author {
    html: string;
    authorId: number;
    image?: ImageDetails;
    imageWidth?: number;
    imageHeight?: number;
    firstName: string;
    lastName: string;
    birthCountry?: string;
    birthDate?: string;
    deathDate?: string;
    summary?: string;
    seriesIdScenario: number[];
    seriesIdDrawing: number[];
    seriesIdBoth: number[];
    constructor($: CheerioStatic);
    private static getImage;
    private getSeriesId;
    getImageDimensions(): Promise<any>;
}
