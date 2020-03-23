import { Album } from "./album";
import { Utils } from "./utils";
import { ImageDetails } from "./image";

export class Serie {
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

  constructor($: CheerioStatic) {
    this.serieId = parseInt($(".idbel").text(), 10);
    this.serieTitle = $("h1 a").text();
    this.serieUrl = $('link[rel="canonical"]').attr("href");

    const statusMatch = $(".serie-info")
      .text()
      .match(/Parution? :(.*)/);
    const serieStatus = statusMatch[1].trim();
    this.type = serieStatus.includes("One shot") ? "One shot" : "Serie";
    this.status = serieStatus.includes("en cours") ? "In progress" : "Done";

    const genreMatch = $(".serie-info")
      .text()
      .match(/Genre? :(.*)/);
    this.genres = genreMatch[1].split(",");

    const numberOfAlbumsMatch = $(".serie-info")
      .text()
      .match(/Tomes? :([0-9]+)/);
    this.numberOfAlbums = numberOfAlbumsMatch
      ? parseInt(numberOfAlbumsMatch[1], 10)
      : 0;

    const langMatch = $(".serie-info")
      .text()
      .match(/Langue? :(.*)/);
    this.lang = langMatch[1].trim();

    this.recommendationsId = this.getRecommendationsId($);
    this.tags = this.getTags($);
    this.summary = $("article.single-block p").text();
  }

  public async addAlbumsInfo(albums: Album[]) {
    this.albumsId = albums.map(album => album.albumId);
    [this.voteAverage, this.voteCount] = this.getVoteAverage(albums);

    await Promise.all(albums.map(a => a.getImageDimensions()));

    if (albums.length == 0) return;

    this.serieCover = albums[0].imageCover;
    this.serieCoverWidth = albums[0].imageCoverWidth;
    this.serieCoverHeight = albums[0].imageCoverHeight;

    this.dateBegin = albums[0].date;
    this.dateEnd = this.status !== "In progress" ? albums[albums.length - 1].date : null;
  }

  private getVoteAverage(albums: Album[]) {
    let voteAverage = 0;
    let voteCount = 0;
    albums.forEach(album => {
      voteAverage += album.voteAverage * album.voteCount;
      voteCount += album.voteCount;
    });
    if (voteCount === 0) {
      return [0, 0];
    }
    return [Math.floor((voteAverage / voteCount) * 10) / 10, voteCount];
  }

  private getRecommendationsId($: CheerioStatic): number[] {
    return $(".alire li a")
      .map((_index, elem) => $(elem).attr("href"))
      .get()
      .map(url => Utils.urlToSerieID(url));
  }

  private getTags($: CheerioStatic): string[] {
    return $(".mot-cle")
      .map((_index, elem) => $(elem).text())
      .get();
  }
}
