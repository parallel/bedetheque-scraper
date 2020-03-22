/// <reference types="cheerio" />
import { Serie } from "./serie";
import { ImageDetails } from "./image";
declare class AuthorDetails {
    pseudo?: string;
    authorId?: number;
    url?: string;
    constructor(pseudo: string, url: string);
}
export declare class Album {
    serieId: number;
    albumId: number;
    albumNumber: number;
    albumUrl: string;
    serieTitle: string;
    albumTitle: string;
    scenario?: AuthorDetails;
    drawing?: AuthorDetails;
    colors?: AuthorDetails;
    date: Date;
    editor?: string;
    isbn?: string;
    nbrOfPages?: number;
    imageCover?: ImageDetails;
    imageCoverWidth?: number;
    imageCoverHeight?: number;
    imageExtract?: ImageDetails;
    imageReverse?: ImageDetails;
    createdAt: Date;
    updatedAt: Date;
    voteAverage: number;
    voteCount: number;
    constructor(page: Cheerio, $: CheerioStatic, serieId: number, serieTitle: string);
    private static findAlbumNumber;
    private static findVoteAverage;
    private findVoteCount;
    private static findCover;
    private static findImage;
    private addDetails;
    private addDetail;
    getImageDimensions(): any;
    static formatAlbumsFromSerie($: CheerioStatic, serie: Serie): Album[];
}
export {};
