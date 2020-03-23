// imageCoverLarge: https://www.bedetheque.com/media/Couvertures/${imageCover}
// imageCoverSmall: https://www.bedetheque.com/cache/thb_couv/${imageCover}
// imageExtractLarge: https://www.bedetheque.com/media/Planches/${imageExtract}
// imageExtractSmall: https://www.bedetheque.com/cache/thb_planches/${imageExtract}
// imageReverseLarge: https://www.bedetheque.com/media/Versos/${imageReverse}
// imageReverseSmall: https://www.bedetheque.com/cache/thb_versos/${imageReverse}

import { Serie } from "./serie";
import { Utils } from "./utils";
import { ImageDetails } from "./image";
import moment from "moment";
import probe from "probe-image-size";
import { isbn } from 'simple-isbn';
class AuthorDetails {
  public name?: string;
  public authorId?: number;
  public url?: string;

  constructor(name: string, url: string) {
    this.name = name.replace('<', '').replace('>', '');
    // generic names
    if (!name.startsWith('<')) {
      this.url = url;
      this.authorId = Utils.urlToAuthorID(url);
    }
  }
}

export class Album {
  public html: string;
  public serieId: number;
  public albumId: number;
  public albumNumber: string;
  public albumUrl: string;
  public serieTitle: string;
  public albumTitle: string;
  public scenario?: AuthorDetails;
  public drawing?: AuthorDetails;
  public colors?: AuthorDetails;
  public date: Date;
  public editor?: string;
  public isbn10?: string;
  public isbn13?: string;
  public nbrOfPages?: number;
  public imageCover?: ImageDetails;
  public imageCoverWidth?: number;
  public imageCoverHeight?: number;
  public imageExtract?: ImageDetails;
  public imageReverse?: ImageDetails;
  public createdAt: Date;
  public updatedAt: Date;

  // voteAverage /100
  public voteAverage: number;
  public voteCount: number;

  constructor(
    page: Cheerio,
    $: CheerioStatic,
    serieId: number,
    serieTitle: string
  ) {
    this.html = $.html();
    this.serieId = serieId;
    this.serieTitle = serieTitle;
    this.albumNumber = Album.findAlbumNumber(page);
    this.albumId = parseInt(
      page
        .children()
        .first()
        .attr("name"),
      10
    );
    this.albumTitle = page.find(".album-main .titre").attr("title");
    this.albumUrl = page.find(".album-main .titre").attr("href");
    this.imageCover = Album.findCover(page);
    this.imageExtract = Album.findImage(page, "browse-planches", "Planches");
    this.imageReverse = Album.findImage(page, "browse-versos", "Versos");
    this.voteAverage = Album.findVoteAverage(page, $);
    this.voteCount = this.findVoteCount(page, $);
    this.addDetails(page, $);
  }

  private static findAlbumNumber(page: Cheerio): string {
    const match = page
      .find(".album-main .titre > span")
      .text()
      .trim()
      .match(/^(.*)./);
    return (match && match[0]) || "1";
  }

  private static findVoteAverage(page: Cheerio, $: CheerioStatic) {
    const voteAverage = page.find(".ratingblock  strong").text();
    return voteAverage ? 20 * parseFloat(voteAverage) : 0;
  }

  private findVoteCount(page: Cheerio, $: CheerioStatic): number {
    if (this.voteAverage === null) {
      return 0;
    }
    const voteCount = page.find(".ratingblock p").text();
    if (!voteCount) {
      return 0;
    }
    return parseInt(voteCount.match(/\(([0-9]+) vote/)[1], 10);
  }

  private static findCover(page: Cheerio): ImageDetails {
    const image = page.find(".couv .titre img").attr("src");
    return image 
      ? new ImageDetails(image, image.replace("https://www.bedetheque.com/cache/thb_couv/", ""))
      : null;
  }

  private static findImage(
    page: Cheerio,
    className: string,
    path: string
  ): ImageDetails {
    const image = page.find(`.sous-couv .${className}`).attr("href");
    return image 
      ? new ImageDetails(image, image.replace(`https://www.bedetheque.com/media/${path}/`, "")) 
      : null;
  }

  private addDetails(page: Cheerio, $: CheerioStatic) {
    page.find(".infos > li").each((_index, info) => {
      const pageInfo = $(info);
      this.addDetail(pageInfo);
    });
  }

  private addDetail(pageInfo: Cheerio) {
    const key = pageInfo
      .find("label")
      .text()
      .trim()
      .toLowerCase()
      .replace(" :", "");

    const link = pageInfo.find("a").attr("href");
    const value = pageInfo.text().split(":")[1]?.trim();

    if (!value) {
      return;
    }

    switch (key) {
      case "scénario":
        this.scenario = new AuthorDetails(value, link);
        break;
      case "dessin":
        this.drawing = new AuthorDetails(value, link);
        break;
      case "couleurs":
        this.colors = new AuthorDetails(value, link);
        break;
      case "dépot légal":
        const date = value.slice(0, 7);
        this.date = moment(date, "MM/YYYY").toDate();
        break;
      case "editeur":
        this.editor = value;
        break;
      case "planches":
        this.nbrOfPages = parseInt(value, 10);
        break;
      case "isbn":
        const isbnValue = value.replace(/-/g, '');
        if (isbnValue.length === 10) {
          this.isbn10 = isbnValue;
          this.isbn13 = isbn.toIsbn13(isbnValue);
        } else {
          this.isbn10 = isbn.toIsbn10(isbnValue);
          this.isbn13 = isbnValue;
        }
        break;
      case "créé le":
        const matches = value.match(/(\d{2})\/(\d{2})\/(\d{4})/g);
        this.createdAt = moment(matches[0], "DD/MM/YYYY").toDate();
        this.updatedAt = moment(matches[1], "DD/MM/YYYY").toDate();
      default:
        break;
    }
  }

  getImageDimensions() {
    if (this.imageCover == null) return;

    return probe(
      `https://www.bedetheque.com/media/Couvertures/${this.imageCover.path}`
    )
      .then((dimension: any) => {
        this.imageCoverWidth = dimension.width;
        this.imageCoverHeight = dimension.height;
      })
      .catch(() => {
        // do nothing
      });
  }

  static formatAlbumsFromSerie($: CheerioStatic, serie: Serie) {
    return ($(".liste-albums > li")
      .map(
        (_index, elem) => new Album($(elem), $, serie.serieId, serie.serieTitle)
      )
      .get() as unknown) as Album[];
  }
}
