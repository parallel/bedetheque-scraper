/// <reference types="cheerio" />
import { ImageDetails } from "./image";
export declare class Author {
    authorId: number;
    image?: ImageDetails;
    imageWidth?: number;
    imageHeight?: number;
    name: string;
    birthDate?: string;
    deathDate?: string;
    seriesIdScenario: number[];
    seriesIdDrawing: number[];
    seriesIdBoth: number[];
    constructor($: CheerioStatic);
    private static getImage;
    private getSeriesId;
    getImageDimensions(): Promise<any>;
}
