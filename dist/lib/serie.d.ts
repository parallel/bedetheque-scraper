/// <reference types="cheerio" />
import { Album } from "./album";
import { ImageDetails } from "./image";
export declare class Serie {
    html: string;
    serieId: number;
    serieTitle: string;
    serieUrl: string;
    genres: string[];
    numberOfAlbums: number;
    serieCover?: ImageDetails;
    serieCoverWidth?: number;
    serieCoverHeight?: number;
    albumsId: number[];
    voteAverage?: number;
    voteCount?: number;
    recommendationsId: number[];
    dateBegin?: Date;
    dateEnd?: Date;
    tags: string[];
    lang: string;
    summary: string;
    status: string;
    type: string;
    constructor($: CheerioStatic);
    addAlbumsInfo(albums: Album[]): Promise<void>;
    private getVoteAverage;
    private getRecommendationsId;
    private getTags;
}
