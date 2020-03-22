export declare class ImageDetails {
    path?: string;
    url?: string;
    constructor(url: string, path: string);
}
export declare const getAuthorPhoto: (imagePath?: string) => string;
export declare const getSerieCover: (imagePath?: string) => string;
export declare const getAlbumCover: (imagePath?: string) => string;
export declare const getAlbumImageExtract: (imagePath?: string) => string;
export declare const getAlbumCoverVerso: (imagePath?: string) => string;
