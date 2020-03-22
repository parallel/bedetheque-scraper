export class ImageDetails {
  public path?: string;
  public url?: string;

  constructor(url: string, path: string) {
    this.path = path;
    this.url = url;
  }
}

export const getAuthorPhoto = (imagePath?: string): string =>
  imagePath && `https://www.bedetheque.com/media/Photos/${imagePath}`;
export const getSerieCover = (imagePath?: string): string =>
  imagePath && `https://www.bedetheque.com/media/Couvertures/${imagePath}`;
export const getAlbumCover = (imagePath?: string): string =>
  imagePath && `https://www.bedetheque.com/media/Couvertures/${imagePath}`;
export const getAlbumImageExtract = (imagePath?: string): string =>
  imagePath && `https://www.bedetheque.com/media/Planches/${imagePath}`;
export const getAlbumCoverVerso = (imagePath?: string): string =>
  imagePath && `https://www.bedetheque.com/media/Versos/${imagePath}`;
